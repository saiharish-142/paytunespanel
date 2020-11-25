import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import { Typography } from '@material-ui/core';
import IconBreadcrumbs from '../components/breadBreed';

export default function DetailedTable() {
    const history = useHistory();
    const {state1,dispatch1} = useContext(IdContext)
    const { campname } = useParams()
    const [ids, setids] = useState([])
    const [datelogs, setdatelogs] = useState([])
    const [publishlogs, setpublishlogs] = useState([])
    const [currentad, setcurrentad] = useState('')
    useEffect(() => {
        if(campname){
            dispatch1({type:"ID",payload:campname})
        }
    }, [campname])
    useEffect(()=>{
        if(campname){
            fetch('/streamingads/getids',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    adtitle:campname
                })
            }).then(res=>res.json())
            .then(idds=>{
                setids(idds)
                // console.log(idds)
            })
            .catch(err=>console.log(err))
        }
    },[campname])
    useEffect(()=>{
        if(ids.length){
            fetch('/report/reportbycamp',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids
                })
            }).then(res=>res.json())
            .then(result=>{
                setpublishlogs(result)
                offlinereportspublisher(result)
                // console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlinereportspublisher = (logs) => {
        fetch('/offreport/reportbycamp',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids
            })
        }).then(res=>res.json())
        .then(result=>{
            var plogs = result
            result.map(adad => {adad.appId.AppName += ' offline'})
            // console.log(result)
            plogs = plogs.concat(logs)
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            // console.log(plogs)
            setpublishlogs(plogs)
            // console.log(result)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(campname){
            fetch(`/streamingads/groupedsingle`,{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    adtitle:campname
                })
            }).then(res=>res.json())
            .then(result=>{
                setcurrentad(result[0])
                // console.log(result[0])
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[campname])
    useEffect(()=>{
        if(ids){
            fetch('/report/detreportcambydat',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids
                })
            }).then(res=>res.json())
            .then(result=>{
                setdatelogs(result)
                offlinereportsdate(result)
                // console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlinereportsdate = (logs) => {
        fetch('/offreport/detreportcambydat',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids
            })
        }).then(res=>res.json())
        .then(async(result)=>{
            var dlogs = result
            // console.log(result,'re')
            dlogs = dlogs.concat(logs)
            dlogs = await dlogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            // console.log(dlogs)
            setdatelogs(dlogs)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    // console.log(id)
    const dateformatchanger = (date) => {
        var dategot = date.toString();
        var datechanged = dategot.slice(8,10) + '-' + dategot.slice(5,7) + '-' + dategot.slice(0,4)
        return datechanged;
    }
    const updatedatetimeseter = (date) => {
        var datee = new Date(date);
        var datee = datee.toString();
        return datee.slice(0,25)
    }
    // console.log(publishlogs.length ? 
    //     publishlogs[0]
    //     : 'notfound.........')
    return (
        <div style={{paddingBottom:'50px'}}>
        <div style={{width:'10vw'}}><button 
                onClick={()=>history.push(`/manageAds/${state1}`)} 
                className='btn #424242 grey darken-3'
                style={{margin:'10px 0 20px 0',textAlign:'left'}}
            >Back</button></div><br />
        <IconBreadcrumbs />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>{state1 && state1.toUpperCase()} Campaign</div>
        <div style={{margin:'0px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Detailed Report</div>
        <TableContainer style={{margin:'10px auto',width:'fit-content'}} component={Paper}>
        <Typography variant="h6" id="tableTitle" component="div">
            Summary
        </Typography>
        <div>last updated at - {datelogs.length ? (datelogs[0].updatedAt ? updatedatetimeseter(datelogs[0].updatedAt) : (datelogs[0].createdOn ? updatedatetimeseter(datelogs[0].createdOn):'not found')) : 'no reports found'}</div>
        <Table style={{margin:'20px',width:'fit-content',border:'1px lightgray solid'}} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Media Type</TableCell>
                <TableCell>impressions</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Spend</TableCell>
                <TableCell>Avg spend per<br /> impression</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {datelogs.length && currentad && datelogs.map((row,i) => (
                <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {dateformatchanger(row.date)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{row.impressions}</TableCell>
                    <TableCell>{row.clicks}</TableCell>
                    <TableCell>{Math.round(row.clicks*100/row.impressions*100)/100}%</TableCell>
                    <TableCell>{row.impressions}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            ))} 
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'50px auto 0 auto',width:'fit-content'}} component={Paper}>
        <Typography variant="h6" id="tableTitle" component="div">
            Publishers wise Report
        </Typography>
        <div>last updated at - {publishlogs.length ? (publishlogs[0] && publishlogs[0].updatedAt ? updatedatetimeseter(publishlogs[0].updatedAt) : (publishlogs[0] && publishlogs[0].createdOn ? updatedatetimeseter(publishlogs[0].createdOn):'not found')) : 'no reports found'}</div>
        <Table style={{margin:'20px',width:'fit-content',border:'1px lightgray solid'}} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Media Type</TableCell>
                <TableCell>Deal Id</TableCell>
                <TableCell>impressions</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Spend</TableCell>
                <TableCell>Avg spend per<br /> impression</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {publishlogs.length && currentad && publishlogs.map((row,i) => (
                row && <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {dateformatchanger(row.date)}
                    </TableCell>
                    <TableCell>{row.Publisher? row.Publisher.AppName : row.appId.AppName} {row.nameads && row.nameads}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{row.impressions>=0 ? row.impressions : row.servedAudioImpressions}</TableCell>
                    <TableCell>{row.clicks>=0 ? row.clicks : row.CompanionClickTracking}</TableCell>
                    <TableCell>{row.clicks>=0 ?  Math.round(row.clicks*100/row.impressions *100)/100 : Math.round(row.CompanionClickTracking*100/row.servedAudioImpressions *100)/100 }%</TableCell>
                    <TableCell>{row.impressions ? row.impressions : row.servedAudioImpressions}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            ))} 
            </TableBody>
        </Table>
        </TableContainer>
        </div>
    );
}