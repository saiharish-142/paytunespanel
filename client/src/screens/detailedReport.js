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
    const [ids, setids] = useState({})
    const [datelogs, setdatelogs] = useState([])
    const [publishlogs, setpublishlogs] = useState([])
    const [datelogsd, setdatelogsd] = useState([])
    const [publishlogsd, setpublishlogsd] = useState([])
    const [datelogsv, setdatelogsv] = useState([])
    const [publishlogsv, setpublishlogsv] = useState([])
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
                // setids(idds)
                fetch('/ads/addetailt',{
                    method:'put',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization" :"Bearer "+localStorage.getItem("jwt")
                    },body:JSON.stringify({
                        campaignId:idds
                    })
                }).then(res=>res.json())
                .then(result => {
                    setids(result)
                    console.log(result)
                }).catch(err=>console.log(err))
                // console.log(idds)
            })
            .catch(err=>console.log(err))
        }
    },[campname])
    useEffect(()=>{
        if(ids && ids.audio){
            fetch('/report/reportbycamp',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.audio
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
                campaignId:ids.audio
            })
        }).then(res=>res.json())
        .then(result=>{
            var plogs = result
            result.map(adad =>{
                if(adad.appId._id.toString() ==='5b2210af504f3097e73e0d8b'|| adad.appId._id.toString() === '5d10c405844dd970bf41e2af'){
                    adad.appId.AppName += ' offline'
                }
            })
            // console.log(result)
            // plogs = plogs.concat(logs)
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn)
                var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn)
                if(a.date === b.date)
                return d2 - d1;
            })
            console.log(plogs)
            setpublishlogs(plogs)
            // console.log(result)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(ids && ids.display){
            fetch('/report/reportbycamp',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.display
                })
            }).then(res=>res.json())
            .then(result=>{
                setpublishlogsd(result)
                offlinereportspublisherd(result)
                // console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlinereportspublisherd = (logs) => {
        fetch('/offreport/reportbycamp',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids.display
            })
        }).then(res=>res.json())
        .then(result=>{
            var plogs = result
            result.map(adad =>{
                if(adad.appId._id.toString() ==='5b2210af504f3097e73e0d8b'|| adad.appId._id.toString() === '5d10c405844dd970bf41e2af'){
                    adad.appId.AppName += ' offline'
                }
            })
            // console.log(result)
            // plogs = plogs.concat(logs)
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn)
                var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn)
                if(a.date === b.date)
                return d2 - d1;
            })
            console.log(plogs)
            setpublishlogsd(plogs)
            // console.log(result)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(ids && ids.video){
            fetch('/report/reportbycamp',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.video
                })
            }).then(res=>res.json())
            .then(result=>{
                setpublishlogsv(result)
                offlinereportspublisherv(result)
                // console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlinereportspublisherv = (logs) => {
        fetch('/offreport/reportbycamp',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids.video
            })
        }).then(res=>res.json())
        .then(result=>{
            var plogs = result
            result.map(adad =>{
                if(adad.appId._id.toString() ==='5b2210af504f3097e73e0d8b'|| adad.appId._id.toString() === '5d10c405844dd970bf41e2af'){
                    adad.appId.AppName += ' offline'
                }
            })
            // console.log(result)
            // plogs = plogs.concat(logs)
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            plogs = plogs.sort(function(a,b){
                var d1 = new Date(a.createdAt ? a.createdAt : a.createdOn)
                var d2 = new Date(b.createdAt ? b.createdAt : b.createdOn)
                if(a.date === b.date)
                return d2 - d1;
            })
            console.log(plogs)
            setpublishlogsv(plogs)
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
        if(ids && ids.audio){
            fetch('/report/detreportcambydat',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.audio
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
                campaignId:ids.audio
            })
        }).then(res=>res.json())
        .then(async(result)=>{
            var dlogs = result
            // console.log(result,'re')
            // dlogs = dlogs.concat(logs)
            dlogs = await dlogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            dlogs = dlogs.sort(function(a,b){
                var d1 = new Date(a.updatedAt[0])
                var d2 = new Date(b.updatedAt[0])
                if(a.date === b.date)
                return d2 - d1;
            })
            console.log(dlogs)
            setdatelogs(dlogs)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(ids && ids.display){
            fetch('/report/detreportcambydat',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.display
                })
            }).then(res=>res.json())
            .then(result=>{
                setdatelogsd(result)
                offlinereportsdated(result)
                // console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlinereportsdated = (logs) => {
        fetch('/offreport/detreportcambydat',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids.display
            })
        }).then(res=>res.json())
        .then(async(result)=>{
            var dlogs = result
            // console.log(result,'re')
            // dlogs = dlogs.concat(logs)
            dlogs = await dlogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            dlogs = dlogs.sort(function(a,b){
                var d1 = new Date(a.updatedAt[0])
                var d2 = new Date(b.updatedAt[0])
                if(a.date === b.date)
                return d2 - d1;
            })
            console.log(dlogs)
            setdatelogsd(dlogs)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(ids && ids.video){
            fetch('/report/detreportcambydat',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.video
                })
            }).then(res=>res.json())
            .then(result=>{
                setdatelogsv(result)
                offlinereportsdatev(result)
                // console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlinereportsdatev = (logs) => {
        fetch('/offreport/detreportcambydat',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids.video
            })
        }).then(res=>res.json())
        .then(async(result)=>{
            var dlogs = result
            // console.log(result,'re')
            // dlogs = dlogs.concat(logs)
            dlogs = await dlogs.sort(function(a,b){
                var d1 = new Date(a.date)
                var d2 = new Date(b.date)
                return d2 - d1
            })
            dlogs = dlogs.sort(function(a,b){
                var d1 = new Date(a.updatedAt[0])
                var d2 = new Date(b.updatedAt[0])
                if(a.date === b.date)
                return d2 - d1;
            })
            console.log(dlogs)
            setdatelogsv(dlogs)
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
        // var datee = new Date(date);
        // var datee = datee.toString();
        var s = new Date(date).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        // console.log(s,date)
        return s.slice(3,5) + '/' + s.slice(0,2) + '/' + s.slice(6,10) + ' ' + s.slice(11,)
    }
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
        <div>last updated at - {datelogs.length ? (datelogs[0].updatedAt ? updatedatetimeseter(datelogs[0].updatedAt[0]) : (datelogs[0].createdOn ? updatedatetimeseter(datelogs[0].createdOn):'not found')) : 'no reports found'}</div>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
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
            {datelogs.length && currentad ? datelogs.map((row,i) => (
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
            )) : 'loading.....'} 
            </TableBody>
        </Table>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Display Type</div>
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
            {datelogsd.length && currentad ? datelogsd.map((row,i) => (
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
            )) : 'loading.....'} 
            </TableBody>
        </Table>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Video Type</div>
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
            {datelogsv.length && currentad ? datelogsv.map((row,i) => (
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
            )) : 'loading.....'} 
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'50px auto 0 auto',width:'fit-content'}} component={Paper}>
        <Typography variant="h6" id="tableTitle" component="div">
            Publishers wise Report
        </Typography>
        <div>last updated at - {publishlogs.length ? (publishlogs[0] && publishlogs[0].updatedAt ? updatedatetimeseter(publishlogs[0].updatedAt) : (publishlogs[0] && publishlogs[0].createdOn ? updatedatetimeseter(publishlogs[0].createdOn):'not found')) : 'no reports found'}</div>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
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
            {publishlogs.length && currentad ? publishlogs.map((row,i) => (
                row && <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {dateformatchanger(row.date)}
                    </TableCell>
                    <TableCell>{row.Publisher? row.Publisher.AppName : row.appId.AppName} {row.nameads && row.nameads}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{row.impressions>=0 ? row.impressions : row.impression}</TableCell>
                    <TableCell>{row.clicks>=0 ? row.clicks : row.CompanionClickTracking}</TableCell>
                    <TableCell>{row.clicks>=0 ?  Math.round(row.clicks*100/row.impressions *100)/100 : Math.round(row.CompanionClickTracking*100/row.impression *100)/100 }%</TableCell>
                    <TableCell>{row.impressions ? row.impressions : row.impression}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )) : 'loading.....'} 
            </TableBody>
        </Table>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Display Type</div>
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
            {publishlogsd.length && currentad ? publishlogsd.map((row,i) => (
                row && <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {dateformatchanger(row.date)}
                    </TableCell>
                    <TableCell>{row.Publisher? row.Publisher.AppName : row.appId.AppName} {row.nameads && row.nameads}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{row.impressions>=0 ? row.impressions : row.impression}</TableCell>
                    <TableCell>{row.clicks>=0 ? row.clicks : row.CompanionClickTracking}</TableCell>
                    <TableCell>{row.clicks>=0 ?  Math.round(row.clicks*100/row.impressions *100)/100 : Math.round(row.CompanionClickTracking*100/row.impression *100)/100 }%</TableCell>
                    <TableCell>{row.impressions ? row.impressions : row.impression}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )) : 'loading.....'} 
            </TableBody>
        </Table>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Video Type</div>
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
            {publishlogsv.length && currentad ? publishlogsv.map((row,i) => (
                row && <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {dateformatchanger(row.date)}
                    </TableCell>
                    <TableCell>{row.Publisher? row.Publisher.AppName : row.appId.AppName} {row.nameads && row.nameads}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{row.impressions>=0 ? row.impressions : row.impression}</TableCell>
                    <TableCell>{row.clicks>=0 ? row.clicks : row.CompanionClickTracking}</TableCell>
                    <TableCell>{row.clicks>=0 ?  Math.round(row.clicks*100/row.impressions *100)/100 : Math.round(row.CompanionClickTracking*100/row.impression *100)/100 }%</TableCell>
                    <TableCell>{row.impressions ? row.impressions : row.impression}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )) : 'loading.....'} 
            </TableBody>
        </Table>
        </TableContainer>
        </div>
    );
}