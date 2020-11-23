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
                setimpre(impressions)
                setclick(clicks)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
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
    const colorfinder = (target,response,tobeimpress,impress) => {
        if(impress && tobeimpress){
            // console.log(tobeimpress,impress)
            if(impress <= tobeimpress){
                if(target>response){
                    return 'yellow'
                }
                if(target<response){
                    return 'white'
                }
                if(target === response){
                    return 'white'
                }
            }else{
                return 'brown'
            }
        }
    }
    const updatedatetimeseter = (date) => {
        var datee = new Date(date);
        var datee = datee.toString();
        return datee.slice(0,25)
    }
    return (
        <>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div>
        <div>last updated at - {logs.length ? (logs[0].updatedAt ? updatedatetimeseter(logs[0].updatedAt) : 'not found') : 'no reports found'}</div>
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
                            singlead.TargetImpressions && singlead.TargetImpressions/timefinder(singlead.endDate[0],singlead.startDate[0]) ,
                            singlead.TargetImpressions && impre/timefinder(Date.now(),singlead.startDate[0]) ,
                            singlead.TargetImpressions && parseInt(singlead.TargetImpressions),
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
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Publisher Wise Summary Report</div>
        <div>last updated at - {logs.length ? (logs[0].updatedAt ? updatedatetimeseter(logs[0].updatedAt) : 'not found') : 'no reports found'}</div>
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
                                log.campaignId.TargetImpressions ? log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate[0],log.campaignId.startDate[0]) : 0,
                                log.campaignId.TargetImpressions ? log.impressions/timefinder(Date.now(),log.campaignId.startDate[0]) : 0,
                                log.campaignId.TargetImpressions && log.campaignId.TargetImpressions,
                                log.impressions
                            )
                        }}
                    >
                        <TableCell>{log.Publisher.AppName}</TableCell>
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
