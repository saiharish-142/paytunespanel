import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { IdContext } from '../App';
import IconBreadcrumbs from './breadBreed';
import { yellow } from '@material-ui/core/colors';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function BasicTable({singlead}) {
    const history = useHistory();
    const {state1} = useContext(IdContext)
    const [logs, setlogs] = useState([])
    const [ids, setids] = useState([])
    const [impre, setimpre] = useState(0)
    const [click, setclick] = useState(0)
    const classes = useStyles();
    // console.log(state1)
    const normal =(val)=>{
        let v = Math.round(val*100)/100
        // console.log(v)
        return v
    }
    useEffect(()=>{
        if(state1){
            fetch('/streamingads/getids',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    adtitle:state1
                })
            }).then(res=>res.json())
            .then(idds=>{
                setids(idds)
                // console.log(idds)
            })
            .catch(err=>console.log(err))
        }
    },[state1])
    useEffect(()=>{
        if(ids){
            fetch('/report/sumreportofcam22',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids
                })
            }).then(res=>res.json())
            .then(result=>{
                var impressions = 0;
                var clicks = 0;
                setlogs(result)
                result.map((re)=>{
                    impressions += re.impressions
                    clicks += re.clicks
                })
                // console.log(result)
                offlineReports(result,impressions,clicks)
                setimpre(impressions)
                setclick(clicks)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlineReports = (logs,imp,clck) => {
        fetch('/offreport/sumreportofcam22',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids
            })
        }).then(res=>res.json())
        .then(result=>{
            var impressions1 = imp;
            var clicks1 = clck;
            var logss = result;
            // console.log(result)
            result.map((re)=>{
                re.nameads = 'Offline'
                impressions1 += re.impressions
                clicks1 += re.clicks
            })
            logss = logss.concat(logs)
            console.log(logss)
            if(logss.length)
            setlogs(logss)
            if(impressions1)
            setimpre(impressions1)
            if(clicks1)
            setclick(clicks1)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    const timefinder = (da1,da2) => {
        var d1 = new Date(da1)
        var d2 = new Date(da2)
        if(d1<d2){
            return 'completed campaign'
        }
        var show = d1.getTime() - d2.getTime();
        var resula = show/(1000 * 3600 * 24) ;
        return Math.round(resula*1)/1 ;
    }
    const dateformatchanger = (date) => {
        var dategot = date.toString();
        var datechanged = dategot.slice(8,10) + '-' + dategot.slice(5,7) + '-' + dategot.slice(0,4)
        return datechanged;
    }
    const colorfinder = (totaltime,lefttime,tobeimpress,impress) => {
        if(tobeimpress > 0){
            if(impress <= tobeimpress){
                if(impress === 0){
                    return 'white'
                }
                if((tobeimpress/totaltime) <= (impress/lefttime)){
                    return 'white'
                }
                if((tobeimpress/totaltime) > (impress/lefttime)){
                    return 'yellow';
                }
            }else{
                return '#ff6666'
            }
        }
    }
    const updatedatetimeseter = (date) => {
        var datee = new Date(date) + 5;
        var datee = datee.toString();
        return datee.slice(0,25)
    }
    console.log(updatedatetimeseter('2020-11-28T18:30:00.541Z'))
    return (
        <>
        <IconBreadcrumbs />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>{state1 && state1.toUpperCase()} Campaign</div>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div>
        <div>last updated at - {logs.length ? (logs[0].updatedAt ? updatedatetimeseter(logs[0].updatedAt[0]) : 'not found') : 'no reports found'}</div>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id ?
                <TableRow 
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate[0],singlead.startDate[0]) ,
                            timefinder(Date.now(),singlead.startDate[0]) ,
                            singlead.TargetImpressions && singlead.TargetImpressions,
                            impre
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
                    <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
                    <TableCell>{singlead.TargetImpressions && singlead.TargetImpressions}</TableCell>
                    <TableCell>{impre}</TableCell>
                    <TableCell>{singlead.TargetImpressions && Math.round(singlead.TargetImpressions/timefinder(singlead.endDate[0],singlead.startDate[0])*10)/10}</TableCell>
                    <TableCell>{Math.round(impre/timefinder(Date.now(),singlead.startDate[0])*10)/10}</TableCell>
                    <TableCell>{click}</TableCell>
                    <TableCell>{Math.round(click*100/impre *100)/100}%</TableCell>
                    <TableCell>{singlead.TargetImpressions&& singlead.TargetImpressions-impre}</TableCell>
                    <TableCell>{timefinder(singlead.endDate[0],Date.now())} days</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Publisher Wise Summary Report</div>
        <div>last updated at - {logs.length ? (logs[0].updatedAt ? updatedatetimeseter(logs[0].updatedAt[0]) : 'not found') : 'no reports found'}</div>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Publisher</TableCell>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id ? logs.length && 
                logs.map((log,i) => {
                    return <TableRow key={i}
                        style={{
                            background: colorfinder(
                                timefinder(log.campaignId.endDate,log.campaignId.startDate),
                                timefinder(Date.now(),log.campaignId.startDate),
                                log.campaignId.TargetImpressions && log.campaignId.TargetImpressions,
                                log.impressions
                            )
                        }}
                    >
                        <TableCell>{log.Publisher.AppName} {log.nameads && log.nameads}</TableCell>
                        <TableCell>{dateformatchanger(log.campaignId.startDate.slice(0,10))}</TableCell>
                        <TableCell>{dateformatchanger(log.campaignId.endDate.slice(0,10))}</TableCell>
                        <TableCell>{timefinder(log.campaignId.endDate,log.campaignId.startDate)} days</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && log.campaignId.TargetImpressions}</TableCell>
                        <TableCell>{log.impressions}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{log.clicks}</TableCell>
                        <TableCell>{Math.round(log.clicks*100/log.impressions *100)/100}%</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions&& log.campaignId.TargetImpressions-log.impressions}</TableCell>
                        <TableCell>{timefinder(log.campaignId.endDate,Date.now())} days</TableCell>
                        <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                    </TableRow>
                })
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>} 
            </TableBody>
        </Table>
        </TableContainer>
        </>
    );
}
