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
                console.log(idds)
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
                console.log(result)
                console.log(impressions)
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
    return (
        <>
        <TableContainer style={{margin:'20px 0'}} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total spend planned for the campaign</TableCell>
                <TableCell>Avg Spend per impression planned</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>Total Spend Till date</TableCell>
                <TableCell>Avg Spend per impression Till Date</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell>Balance Spend</TableCell>
                <TableCell>Avg required</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id ?
                <TableRow>
                    <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
                    <TableCell>{singlead.TargetImpressions && singlead.TargetImpressions}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
                    <TableCell>{impre}</TableCell>
                    <TableCell>{click}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{singlead.TargetImpressions&& singlead.TargetImpressions-impre}</TableCell>
                    <TableCell>{timefinder(singlead.endDate[0],Date.now())} days</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'20px 0'}} component={Paper}>
        <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Publisher Wise Summary Report</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Publisher</TableCell>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total spend planned for the campaign</TableCell>
                <TableCell>Avg Spend per impression planned</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>Total Spend Till date</TableCell>
                <TableCell>Avg Spend per impression Till Date</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell>Balance Spend</TableCell>
                <TableCell>Avg required</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id ? logs.length && 
                logs.map((log,i) => {
                    return <TableRow key={i}>
                        <TableCell>{log.Publisher.AppName}</TableCell>
                        <TableCell>{dateformatchanger(log.campaignId.startDate.slice(0,10))}</TableCell>
                        <TableCell>{dateformatchanger(log.campaignId.endDate.slice(0,10))}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && log.campaignId.TargetImpressions}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{timefinder(log.campaignId.endDate,log.campaignId.startDate)} days</TableCell>
                        <TableCell>{log.impressions}</TableCell>
                        <TableCell>{log.clicks}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{log.campaignId.TargetImpressions&& log.campaignId.TargetImpressions-log.impressions}</TableCell>
                        <TableCell>{timefinder(log.campaignId.endDate,Date.now())} days</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
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
