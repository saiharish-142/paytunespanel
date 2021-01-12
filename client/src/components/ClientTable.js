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
import Auditable from './auditable.js'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function BasicTable({singlead}) {
    const history = useHistory();
    const {state1} = useContext(IdContext)
    const [logs, setlogs] = useState([])
    const [ids, setids] = useState({})
    const [impre, setimpre] = useState(0)
    const [fq, setfq] = useState(0)
    const [sq, setsq] = useState(0)
    const [tq, settq] = useState(0)
    const [complete, setcomplete] = useState(0)
    const [ratio, setratio] = useState(0)
    const [ratiod, setratiod] = useState(0)
    const [click, setclick] = useState(0)
    const [uniquesumcamp, setuniquesumcamp] = useState(0)
    const [uniquesumcampd, setuniquesumcampd] = useState(0)
    const [logsd, setlogsd] = useState([])
    // const [idsd, setidsd] = useState([])
    const [impred, setimpred] = useState(0)
    const [clickd, setclickd] = useState(0)
    const classes = useStyles();
    // const normal =(val)=>{
    //     let v = Math.round(val*100)/100
    //     // console.log(v)
    //     return v
    // }
    useEffect(()=>{
        if(state1){
            fetch('/logs/uniqueone',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    title:state1
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result[0])
                setuniquesumcamp(result[0].audiouser)
                setuniquesumcampd(result[0].displayuser)
            })
            .catch(err=>console.log(err))
        }
    },[state1])
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
                // console.log(idds)
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
            })
            .catch(err=>console.log(err))
        }
    },[state1])
    useEffect(()=>{
        if(ids && ids.audio){
            fetch('/report/sumreportofcam22',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.audio
                })
            }).then(res=>res.json())
            .then(result=>{
                var impressions = 0;
                var clicks = 0;
                var completes = 0;
                var firstq = 0;
                var secq = 0;
                var thirdq = 0;
                setlogs(result)
                result.map((re)=>{
                    impressions += re.impressions
                    firstq += re.firstQuartile
                    secq += re.midpoint
                    thirdq += re.thirdQuartile
                    completes += re.complete
                    clicks += re.clicks
                })
                var uniquenum = 0;
                var uniimprenum = 0;
                result.map(log => {
                    log.campunique = log.campunique.sort(function(a,b){return b-a;})
                    uniquenum += log.campunique[0]
                    uniimprenum += log.impressions
                })
                // console.log(uniquenum/uniimprenum,uniquenum,uniimprenum)
                setratio(uniquenum/uniimprenum)
                // setuniquesumcamp(uniquenum)
                // console.log(firstq,secq,thirdq,completes)
                offlineReports(result,impressions,clicks,firstq,secq,thirdq,completes)
                setimpre(impressions)
                setclick(clicks)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlineReports = (logs,imp,clck,firq,secq,thirq,compo) => {
        fetch('/offreport/sumreportofcam22',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids.audio
            })
        }).then(res=>res.json())
        .then(result=>{
            var impressions1 = imp;
            var clicks1 = clck;
            var firt1 = firq;
            var sec1 = secq;
            var thir1 = thirq;
            var compo1 = compo;
            var logss = result;
            // console.log(result)
            result.map((re)=>{
                re.nameads = 'Offline'
                impressions1 += re.impressions
                clicks1 += re.clicks
                firt1 += re.firstQuartile ? re.firstQuartile : 0
                sec1 += re.midpoint ? re.midpoint : 0
                thir1 += re.thirdQuartile ? re.thirdQuartile : 0
                compo1 += re.complete ? re.complete : 0
            })
            logss = logss.concat(logs)
            logss = logss.filter(x => x.impressions!==0)
            logss = logss.sort(function(a,b){
                var d1 = new Date(a.updatedAt[0])
                var d2 = new Date(b.updatedAt[0])
                return d2 - d1
            })
            console.log(logss)
            if(logss.length)
            setlogs(logss)
            if(impressions1)
            setimpre(impressions1)
            if(clicks1)
            setclick(clicks1)
            if(firt1)
            setfq(firt1)
            if(sec1)
            setsq(sec1)
            if(thir1)
            settq(thir1)
            if(compo1)
            setcomplete(compo1)
        })
        .catch(err =>{
            console.log(err)
        })
    }
    useEffect(()=>{
        if(ids && ids.display){
            fetch('/report/sumreportofcam22',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.display
                })
            }).then(res=>res.json())
            .then(result=>{
                var impressions = 0;
                var clicks = 0;
                setlogsd(result)
                result.map((re)=>{
                    impressions += re.impressions
                    clicks += re.clicks
                })
                var uniquenum = 0;
                var unimprenum = 0;
                result.map(log => {
                    log.campunique = log.campunique.sort(function(a,b){return b-a;})
                    uniquenum += log.campunique[0]
                    unimprenum += log.impressions
                })
                setratiod(uniquenum/unimprenum)
                // console.log(uniquenum/unimprenum)
                // setuniquesumcampd(uniquenum)
                // console.log(result)
                offlineReportsd(result,impressions,clicks)
                setimpred(impressions)
                setclickd(clicks)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const offlineReportsd = (logs,imp,clck) => {
        fetch('/offreport/sumreportofcam22',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                campaignId:ids.display
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
            logss = logss.sort(function(a,b){
                var d1 = new Date(a.updatedAt[0])
                var d2 = new Date(b.updatedAt[0])
                return d2 - d1
            })
            console.log(logss)
            if(logss.length)
            setlogsd(logss)
            if(impressions1)
            setimpred(impressions1)
            if(clicks1)
            setclickd(clicks1)
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
        // console.log(date)
        // var datee = new Date(date);
        var s = new Date(date).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        // var datee = datee.toString();
        // console.log(s,date,s.split('/'))
        s = s.split('/')
        return s[1] + '/' + s[0] + '/' + s[2]
    }
    const uniquetopfinder = (dataunique) => {
        var gotdata = dataunique;
        gotdata = gotdata.sort(function(a,b){return b-a;})
        return gotdata[0];
    }
    // console.log(Date('2020-11-28T18:30:00.541Z').toString())
    // console.log(Date('2020-11-28T18:30:00.541Z'))
    // console.log(Date('2020-11-28T18:30:00.541Z'))
    const datefinder = () => {
        if(logs.length){
            if(logs[0].updatedAt && logs[0].updatedAt.length){
                return updatedatetimeseter(logs[0].updatedAt[0])
            }else{
                if(logsd.length){
                    if(logsd[0].updatedAt && logsd[0].updatedAt.length){
                        return updatedatetimeseter(logsd[0].updatedAt[0])
                    }else{
                        return 'not found'
                    }
                }else{
                    return 'not found';
                }
            }
        }else{
            return 'not found'
        }
    }
    return (
        <>
        <IconBreadcrumbs />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>{state1 && state1.toUpperCase()} Campaign</div>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Unique Users</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id && (logs.length>0) && ids ?
                <TableRow 
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate[0],singlead.startDate[0]) ,
                            timefinder(Date.now(),singlead.startDate[0]) ,
                            ids && ids.audimpression,
                            impre
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
                    <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
                    <TableCell>{ids && ids.audimpression}</TableCell>
                    <TableCell>{impre}</TableCell>
                    <TableCell>{Math.round(ratio*impre) + 1}</TableCell>
                    <TableCell>{click}</TableCell>
                    <TableCell>{Math.round(click*100/impre *100)/100}%</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
        <div style={{margin:'5px',fontWeight:'bolder'}}>Display Type</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Unique Users</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id && ids && (logsd.length>0) ?
                <TableRow 
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate[0],singlead.startDate[0]) ,
                            timefinder(Date.now(),singlead.startDate[0]) ,
                            ids && ids.disimpression,
                            impred
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate[0])}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate[0])}</TableCell>
                    <TableCell>{timefinder(singlead.endDate[0],singlead.startDate[0])} days</TableCell>
                    <TableCell>{ids && ids.disimpression}</TableCell>
                    <TableCell>{impred}</TableCell>
                    <TableCell>{Math.round(ratiod*impred) + 1}</TableCell>
                    <TableCell>{clickd}</TableCell>
                    <TableCell>{Math.round(clickd*100/impred *100)/100}%</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Quartile Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <TableContainer  style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>First Quartile</TableCell>
                        <TableCell>Second Quartile</TableCell>
                        <TableCell>Third Quartile</TableCell>
                        <TableCell>Complete</TableCell>
                        <TableCell>Total Impresions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Impressions</TableCell>
                        <TableCell>{fq}</TableCell>
                        <TableCell>{sq > 0 && sq}</TableCell>
                        <TableCell>{tq}</TableCell>
                        <TableCell>{complete > 0 && complete}</TableCell>
                        <TableCell>{impre}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Platform Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.audio} client={true} url='phonePlatformsum' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.display} client={true} url='phonePlatformsum' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Pincode Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Pincode' ratio={ratio} regtitle='pincode' jsotitle='zip' ids={ids && ids.audio} client={true} url='pincodesum' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Device Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.audio} client={true} url='deviceModelsum' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.display} client={true} url='deviceModelsum' />
        </>
    );
}
