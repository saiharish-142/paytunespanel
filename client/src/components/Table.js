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

export default function BasicTable({singlead,title}) {
    const history = useHistory();
    const {state1} = useContext(IdContext)
    const [logs, setlogs] = useState([])
    const [spentdata, setspentdata] = useState([])
    const [ids, setids] = useState({})
    const [impre, setimpre] = useState(0)
    const [fq, setfq] = useState(0)
    const [sq, setsq] = useState(0)
    const [tq, settq] = useState(0)
    const [complete, setcomplete] = useState(0)
    // const [fqd, setfqd] = useState(0)
    // const [sqd, setsqd] = useState(0)
    // const [tqd, settqd] = useState(0)
    // const [completed, setcompleted] = useState(0)
    const [click, setclick] = useState(0)
    // const [uniquesumcamp, setuniquesumcamp] = useState(0)
    // const [uniquesumcampd, setuniquesumcampd] = useState(0)
    // const [uniquesumcampv, setuniquesumcampv] = useState(0)
    const [logsd, setlogsd] = useState([])
    const [logsv, setlogsv] = useState([])
    // const [idsd, setidsd] = useState([])
    const [impred, setimpred] = useState(0)
    const [clickd, setclickd] = useState(0)
    const [imprev, setimprev] = useState(0)
    const [clickv, setclickv] = useState(0)
    const classes = useStyles();
    // const normal =(val)=>{
    //     let v = Math.round(val*100)/100
    //     // console.log(v)
    //     return v
    // }
    // unique users finder audio
    // useEffect(()=>{
    //     if(ids){
    //         fetch('/subrepo/uniqueusersbycampids',{
    //             method:'put',
    //             headers:{
    //                 "Content-Type":"application/json",
    //                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
    //             },body:JSON.stringify({
    //                 campaignId:ids.audio
    //             })
    //         }).then(res=>res.json())
    //         .then(result=>{
    //             console.log(result[0])
    //             setuniquesumcamp(result[0].unique)
    //         })
    //         .catch(err=>console.log(err))
    //     }
    // },[ids])
    // unique users finder display
    // useEffect(()=>{
    //     if(ids){
    //         fetch('/subrepo/uniqueusersbycampids',{
    //             method:'put',
    //             headers:{
    //                 "Content-Type":"application/json",
    //                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
    //             },body:JSON.stringify({
    //                 campaignId:ids.display
    //             })
    //         }).then(res=>res.json())
    //         .then(result=>{
    //             console.log(result[0])
    //             setuniquesumcampd(result[0].unique)
    //         })
    //         .catch(err=>console.log(err))
    //     }
    // },[ids])
    // // unique users finder video
    // useEffect(()=>{
    //     if(ids){
    //         fetch('/subrepo/uniqueusersbycampids',{
    //             method:'put',
    //             headers:{
    //                 "Content-Type":"application/json",
    //                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
    //             },body:JSON.stringify({
    //                 campaignId:ids.video
    //             })
    //         }).then(res=>res.json())
    //         .then(result=>{
    //             console.log(result[0])
    //             setuniquesumcampv(result[0].unique)
    //         })
    //         .catch(err=>console.log(err))
    //     }
    // },[ids])
    // id finder useEffect
    useEffect(()=>{
        if(state1){
            fetch(`/bundles/unp/${state1}`,{
                method:'get',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(idds=>{
                // console.log(idds.ids)
                var idsa = idds.ids
                idsa = [...new Set(idsa)];
                // console.log(idds.ids,idsa)
                fetch('/ads/addetailt',{
                    method:'put',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization" :"Bearer "+localStorage.getItem("jwt")
                    },body:JSON.stringify({
                        campaignId:idsa
                    })
                }).then(res=>res.json())
                .then(result => {
                    if(result.spear.length === 0){
                        setids(result)
                        console.log(result)
                    }else{
                        fetch('/streamingads/reqtarget',{
                            method:'put',
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization" :"Bearer "+localStorage.getItem("jwt")
                            },body:JSON.stringify({
                                ids:result.spear
                            })
                        }).then(res=>res.json())
                        .then(resuda=>{
                            setids(result)
                            console.log(result.audio)
                            console.log(result)
                            console.log(resuda)
                        })
                        .catch(err=>console.log(err))
                    }
                }).catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        }
    },[state1])
    // spent reciver of all data
    useEffect(() => {
        if(ids){
            var allids = [];
            allids = allids.concat(ids.audio)
            allids = allids.concat(ids.display)
            allids = allids.concat(ids.video)
            // console.log(allids)
            fetch('/subrepo/spentallrepobyid2',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:allids
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                setspentdata(result)
            })
            .catch(err=>console.log(err))
        }
    }, [ids])
    // logs puller for audio campaigns
    useEffect(()=>{
        if(ids && ids.audio){
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
                var impressions1 = 0;
                var clicks1 = 0;
                var firt1 = 0;
                var sec1 = 0;
                var thir1 = 0;
                var compo1 = 0;
                var logss = result;
                console.log(result)
                result.map((re)=>{
                    if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
                        re.nameads = 'Offline'
                    }console.log(re)
                    impressions1 += re.impressions
                    clicks1 += re.clicks
                    firt1 += re.firstQuartile ? re.firstQuartile : 0
                    sec1 += re.midpoint ? re.midpoint : 0
                    thir1 += re.thirdQuartile ? re.thirdQuartile : 0
                    compo1 += re.complete ? re.complete : 0
                })
                logss = logss.filter(x => x.impressions!==0)
                logss = logss.sort(function(a,b){
                    var d1 = new Date(a.updatedAt[0])
                    var d2 = new Date(b.updatedAt[0])
                    return d2 - d1
                })
                // console.log(logss)
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
                if(re.appId==='5b2210af504f3097e73e0d8b'|| re.appId === '5d10c405844dd970bf41e2af')
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
            // console.log(logss)
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
    // logs puller for display campaigns
    useEffect(()=>{
        if(ids && ids.display){
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
                var impressions1 = 0;
                var clicks1 = 0;
                var logss = result;
                // console.log(result)
                result.map((re)=>{
                    if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
                        re.nameads = 'Offline'
                    }impressions1 += re.impressions
                    clicks1 += re.clicks
                })
                logss = logss.sort(function(a,b){
                    var d1 = new Date(a.updatedAt[0])
                    var d2 = new Date(b.updatedAt[0])
                    return d2 - d1
                })
                // console.log(logss)
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
                if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
                    re.nameads = 'Offline'
                }impressions1 += re.impressions
                clicks1 += re.clicks
            })
            logss = logss.concat(logs)
            logss = logss.sort(function(a,b){
                var d1 = new Date(a.updatedAt[0])
                var d2 = new Date(b.updatedAt[0])
                return d2 - d1
            })
            // console.log(logss)
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
    // logs puller for video campaigns
    useEffect(()=>{
        if(ids && ids.video){
            fetch('/offreport/sumreportofcam22',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids.video
                })
            }).then(res=>res.json())
            .then(result=>{
                var impressions1 = 0;
                var clicks1 = 0;
                var logss = result;
                // console.log(result)
                result.map((re)=>{
                    if(re.Publisher._id.toString() ==='5b2210af504f3097e73e0d8b'|| re.Publisher._id.toString() === '5d10c405844dd970bf41e2af'){
                        re.nameads = 'Offline'
                    }impressions1 += re.impressions
                    clicks1 += re.clicks
                })
                logss = logss.sort(function(a,b){
                    var d1 = new Date(a.updatedAt[0])
                    var d2 = new Date(b.updatedAt[0])
                    return d2 - d1
                })
                // console.log(logss)
                if(logss.length)
                setlogsv(logss)
                if(impressions1)
                setimprev(impressions1)
                if(clicks1)
                setclickv(clicks1)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[ids])
    const timefinder = (da1,da2) => {
        var d1 = new Date(da1)
        var d2 = new Date(da2)
        if(d1 === d2){
            return 1;
        }
        if(d1<d2){
            return 'completed campaign'
        }
        var show = d1.getTime() - d2.getTime();
        var resula = show/(1000 * 3600 * 24) ;
        if(Math.round(resula*1)/1 === 0){
            resula = 1;
        }
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
    const datefinder = () => {
        if(logs.length){
            if(logs[0].updatedAt && logs[0].updatedAt.length){
                return updatedatetimeseter(logs[0].updatedAt[0])
            }else{
                if(logsd.length){
                    if(logsd[0].updatedAt && logsd[0].updatedAt.length){
                        return updatedatetimeseter(logsd[0].updatedAt[0])
                    }else{
                        if(logsv.length){
                            if(logsv[0].updatedAt && logsv[0].updatedAt.length){
                                return updatedatetimeseter(logsv[0].updatedAt[0])
                            }else{
                                return 'not found'
                            }
                        }else{
                            return 'not found';
                        }
                    }
                }else{
                    return 'not found';
                }
            }
        }else{
            return 'not found'
        }
    }
    const spentfinder = (appId,campaignId) => {
        if(spentdata.length){
            var datarq = spentdata.filter(x => x.campaignId === campaignId && x.appId === appId)
            var spent = 0;
            // console.log(datarq)
            datarq.map(dat=>{
                spent += parseInt(dat.totalSpent)
            })
            return spent;
        }
        return 0;
    }
    const completespentfider = (camstype) =>{
        if(camstype === 'audio' && spentdata){
            var allspentdatareq = spentdata.filter(x=> ids.audio.includes(x.campaignId))
            var spent = 0;
            allspentdatareq.map(dat => {
                spent += parseFloat(dat.totalSpent)
            })
            return Math.round(spent*10000)/10000;
        }
        if(camstype === 'display' && spentdata){
            var allspentdatareq = spentdata.filter(x=> ids.display.includes(x.campaignId))
            var spent = 0;
            allspentdatareq.map(dat => {
                spent += parseFloat(dat.totalSpent)
            })
            return Math.round(spent*10000)/10000;
        }
        if(camstype === 'video' && spentdata){
            var allspentdatareq = spentdata.filter(x=> ids.video.includes(x.campaignId))
            var spent = 0;
            allspentdatareq.map(dat => {
                spent += parseFloat(dat.totalSpent)
            })
            return Math.round(spent*10000)/10000;
        }
        if(camstype === 'all' && spentdata){
            var allspentdatareq = spentdata
            var spent = 0;
            allspentdatareq.map(dat=>{
                spent += parseFloat(dat.totalSpent)
            })
            return Math.round(spent*10000)/10000;
        }
        return 0;
    }
    return (
        <>
        <IconBreadcrumbs />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>{title && title.toUpperCase()} Campaign</div>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Complete Report</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id && (logs.length>0 || logsd.length>0 || logsv.length>0) && ids ?
                <TableRow
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate,singlead.startDate) ,
                            timefinder(Date.now(),singlead.startDate) ,
                            ids && (ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 ),
                            impre + impred + imprev
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate)}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate)}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,singlead.startDate)} days</TableCell>
                    <TableCell>{ids && (ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 ) }</TableCell>
                    <TableCell>{impre + impred + imprev}</TableCell>
                    {/* <TableCell>{uniquesumcamp + uniquesumcampd + uniquesumcampv}</TableCell> */}
                    <TableCell>{ids &&  Math.round(((ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 ))/timefinder(singlead.endDate,singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{Math.round((impre + impred + imprev)/timefinder(Date.now(),singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{completespentfider('all')}</TableCell>
                    <TableCell>{click + clickd + clickv}</TableCell>
                    <TableCell>{Math.round((click + clickd + clickv)*100/(impre + impred + imprev) *100)/100}%</TableCell>
                    <TableCell>{ids && (ids.audimpression ? ids.audimpression : 0 ) + (ids.disimpression ? ids.disimpression : 0 ) + (ids.vidimpression ? ids.vidimpression : 0 )- impre - impred - imprev}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,Date.now())} days</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
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
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id && (logs.length>0) && ids ?
                <TableRow
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate,singlead.startDate) ,
                            timefinder(Date.now(),singlead.startDate) ,
                            ids && ids.audimpression,
                            impre
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate)}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate)}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,singlead.startDate)} days</TableCell>
                    <TableCell>{ids && ids.audimpression}</TableCell>
                    <TableCell>{impre}</TableCell>
                    {/* <TableCell>{uniquesumcamp}</TableCell> */}
                    <TableCell>{ids &&  Math.round(ids.audimpression/timefinder(singlead.endDate,singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{Math.round(impre/timefinder(Date.now(),singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{completespentfider('audio')}</TableCell>
                    <TableCell>{click}</TableCell>
                    <TableCell>{Math.round(click*100/impre *100)/100}%</TableCell>
                    <TableCell>{ids && ids.audimpression-impre}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,Date.now())} days</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
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
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id && ids && (logsd.length>0) ?
                <TableRow
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate,singlead.startDate) ,
                            timefinder(Date.now(),singlead.startDate) ,
                            ids && ids.disimpression,
                            impred
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate)}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate)}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,singlead.startDate)} days</TableCell>
                    <TableCell>{ids && ids.disimpression}</TableCell>
                    <TableCell>{impred}</TableCell>
                    {/* <TableCell>{uniquesumcampd}</TableCell> */}
                    <TableCell>{ids && Math.round(ids.disimpression/timefinder(singlead.endDate,singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{Math.round(impred/timefinder(Date.now(),singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{completespentfider('display')}</TableCell>
                    <TableCell>{clickd}</TableCell>
                    <TableCell>{Math.round(clickd*100/impred *100)/100}%</TableCell>
                    <TableCell>{ids && ids.disimpression-impred}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,Date.now())} days</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
        <div style={{margin:'5px',fontWeight:'bolder'}}>Video Type</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id && ids && (logsv.length>0) ?
                <TableRow
                    style={{
                        background: colorfinder(
                            timefinder(singlead.endDate,singlead.startDate) ,
                            timefinder(Date.now(),singlead.startDate) ,
                            ids && ids.disimpression,
                            impred
                        )
                    }}
                >
                    <TableCell>{dateformatchanger(singlead.startDate)}</TableCell>
                    <TableCell>{dateformatchanger(singlead.endDate)}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,singlead.startDate)} days</TableCell>
                    <TableCell>{ids && ids.vidimpression}</TableCell>
                    <TableCell>{imprev}</TableCell>
                    {/* <TableCell>{uniquesumcampv}</TableCell> */}
                    <TableCell>{ids && Math.round(ids.vidimpression/timefinder(singlead.endDate,singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{Math.round(impred/timefinder(Date.now(),singlead.startDate)*10)/10}</TableCell>
                    <TableCell>{completespentfider('display')}</TableCell>
                    <TableCell>{clickv}</TableCell>
                    <TableCell>{Math.round(clickv*100/imprev *100)/100}%</TableCell>
                    <TableCell>{ids && ids.disimpression-imprev}</TableCell>
                    <TableCell>{timefinder(singlead.endDate,Date.now())} days</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Publisher Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Publisher</TableCell>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
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
                        <TableCell>{log.publishunique && uniquetopfinder(log.publishunique)}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
                        {/* <TableCell>{spentfinder(log.Publisher._id,log.campaignId._id)}</TableCell> */}
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
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Display Type</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Publisher</TableCell>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id ? logsd.length &&
                logsd.map((log,i) => {
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
                        {/* <TableCell>{log.publishunique && uniquetopfinder(log.publishunique)}</TableCell> */}
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{spentfinder(log.Publisher._id,log.campaignId._id)}</TableCell>
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
        <TableContainer style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Video Type</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Publisher</TableCell>
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Avg required</TableCell>
                <TableCell>Avg Achieved</TableCell>
                <TableCell>Total spent</TableCell>
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead._id ? logsv.length &&
                logsv.map((log,i) => {
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
                        {/* <TableCell>{log.publishunique && uniquetopfinder(log.publishunique)}</TableCell> */}
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.campaignId.TargetImpressions/timefinder(log.campaignId.endDate,log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{log.campaignId.TargetImpressions && Math.round(log.impressions/timefinder(Date.now(),log.campaignId.startDate) *10)/10}</TableCell>
                        <TableCell>{spentfinder(log.Publisher._id,log.campaignId._id)}</TableCell>
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
        <TableContainer  style={{margin:'20px 0'}} elevation={3} component={Paper}>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Publisher Wise</div>
            <div style={{margin:'5px',fontWeight:'bolder'}}>Audio Type</div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Publisher</TableCell>
                        <TableCell>First Quartile</TableCell>
                        <TableCell>Second Quartile</TableCell>
                        <TableCell>Third Quartile</TableCell>
                        <TableCell>Complete</TableCell>
                        <TableCell>Total Impresions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs ? logs.map((log,i) => {
                        if(!log.nameads){
                            return <TableRow key = {i}>
                                <TableCell>{log.Publisher.AppName}</TableCell>
                                <TableCell>{log.firstQuartile}</TableCell>
                                <TableCell>{log.midpoint}</TableCell>
                                <TableCell>{log.thirdQuartile}</TableCell>
                                <TableCell>{log.complete}</TableCell>
                                <TableCell>{log.impressions}</TableCell>
                            </TableRow>
                        }
                    }): <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Region Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Region' regtitle='region' jsotitle='region' ids={ids && ids.audio} url='regionbycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Region' regtitle='region' jsotitle='region' ids={ids && ids.display} url='regionbycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Region' regtitle='region' jsotitle='region' ids={ids && ids.video} url='regionbycampids' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Language Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Language' regtitle='language' jsotitle='language' ids={ids && ids.audio} url='citylanguagebycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Language' regtitle='language' jsotitle='language' ids={ids && ids.display} url='citylanguagebycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Language' regtitle='language' jsotitle='language' ids={ids && ids.video} url='citylanguagebycampids' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Phone Make Model Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Platform Type' regtitle='phoneModel' jsotitle='phoneModel' ids={ids && ids.audio} url='phoneModelbycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Platform Type' regtitle='phoneModel' jsotitle='phoneModel' ids={ids && ids.display} url='phoneModelbycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Platform Type' regtitle='phoneModel' jsotitle='phoneModel' ids={ids && ids.video} url='phoneModelbycampids' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Platform Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.audio} url='platformTypebycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.display} url='platformTypebycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.video} url='platformTypebycampids' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Pincode Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Pincode' regtitle='pincode' jsotitle='zip' ids={ids && ids.audio} url='zipbycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Pincode' regtitle='pincode' jsotitle='zip' ids={ids && ids.display} url='zipbycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Pincode' regtitle='pincode' jsotitle='zip' ids={ids && ids.video} url='zipbycampids' />
        {/* <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Phone Model Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Phone Model' regtitle='phoneMake' jsotitle='phoneMake' ids={ids && ids.audio} url='phonemakebycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Phone Model' regtitle='phoneMake' jsotitle='phoneMake' ids={ids && ids.display} url='phonemakebycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Phone Model' regtitle='phoneMake' jsotitle='phoneMake' ids={ids && ids.video} url='phonemakebycampids' /> */}
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Device Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.audio} url='pptypebycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.display} url='pptypebycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.video} url='pptypebycampids' />
        </>
    );
}
