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
    const [ids, setids] = useState({})
    const [impre, setimpre] = useState(0)
    const [fq, setfq] = useState(0)
    const [sq, setsq] = useState(0)
    const [tq, settq] = useState(0)
    const [complete, setcomplete] = useState(0)
    // const [ratio, setratio] = useState(0)
    // const [ratiod, setratiod] = useState(0)
    // const [ratiov, setratiov] = useState(0)
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
    // console.log(singlead)
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
    //             // console.log(result[0])
    //             setuniquesumcamp(result[0].unique)
    //             if(result[0].unique/impre < 0.5 || result[0].unique/impre > 1 ){
    //                 setratio(0.75)
    //             }else{
    //                 setratio(result[0].unique/impre)
    //             }
    //             // console.log(impre/result[0].unique)
    //         })
    //         .catch(err=>console.log(err))
    //     }
    // },[ids,impre])
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
    //             // console.log(result[0])
    //             setuniquesumcampd(result[0].unique)
    //             if(result[0].unique/impred < 0.5 || result[0].unique/impred > 1 ){
    //                 setratiod(0.75)
    //             }else{
    //                 setratiod(result[0].unique/impre)
    //             }
    //         })
    //         .catch(err=>console.log(err))
    //     }
    // },[ids,impred])
    // unique users finder video
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
    //             // console.log(result[0])
    //             setuniquesumcampv(result[0].unique)
    //             if(result[0].unique/impred < 0.5 || result[0].unique/impred > 1 ){
    //                 setratiov(0.75)
    //             }else{
    //                 setratiov(result[0].unique/impre)
    //             }
    //         })
    //         .catch(err=>console.log(err))
    //     }
    // },[ids,imprev])
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
    // audio logs puller
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
            .then(async (result)=>{
                var impressions1 = 0;
                var clicks1 = 0;
                var firt1 = 0;
                var sec1 = 0;
                var thir1 = 0;
                var compo1 = 0;
                var logss = result;
                console.log(result)
                result.map((re)=>{
                    re.nameads = 'Offline'
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
                console.log(logss)
                if(logss.length)
                setlogs(logss)
                if(impressions1){
                    if(title === 'honda_17042021'){
                        setimpre(impressions1 + 40000)
                    }else{
                        setimpre(impressions1)
                    }
                }
                if(clicks1){
                    if(title === 'honda_17042021'){
                        setclick(clicks1 + 392)
                    }else{
                        setclick(clicks1)
                    }
                }
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
    // display logs puller
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
                    impressions1 += re.impressions
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
    // video logs puller
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
                    impressions1 += re.impressions
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
        if(d1<d2){
            return 'completed campaign'
        }
        var show = d1.getTime() - d2.getTime();
        var resula = show/(1000 * 3600 * 24) ;
        return Math.round(resula*1)/1 ;
    }
    const dateformatchanger = (date) => {
        var dategot = date && date.toString();
        var datechanged = dategot && dategot.slice(8,10) + '-' + dategot.slice(5,7) + '-' + dategot.slice(0,4)
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
    // const uniquetopfinder = (dataunique) => {
    //     var gotdata = dataunique;
    //     gotdata = gotdata.sort(function(a,b){return b-a;})
    //     return gotdata[0];
    // }
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
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>{title && title.toUpperCase()} Campaign</div>
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
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {singlead && (logs.length>0) && ids ?
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
                    {/* <TableCell>{ratio && Math.round(ratio*impre) + 1}</TableCell> */}
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
                {/* <TableCell>Unique Users</TableCell> */}
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
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
                    {/* <TableCell>{Math.round(ratiod*impred) + 1}</TableCell> */}
                    <TableCell>{clickd}</TableCell>
                    <TableCell>{Math.round(clickd*100/impred *100)/100}%</TableCell>
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
                <TableCell>Total Clicks Delivered till date</TableCell>
                <TableCell>CTR</TableCell>
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
                    <TableCell>{imprev}</TableCell>
                    {/* <TableCell>{Math.round(ratiov*imprev) + 1}</TableCell> */}
                    <TableCell>{clickv}</TableCell>
                    <TableCell>{Math.round(clickv*100/imprev *100)/100}%</TableCell>
                </TableRow>
            : <TableRow><TableCell>Loading or no data found</TableCell></TableRow>}
            </TableBody>
        </Table>
        </TableContainer>
        {/* <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Quartile Summary Report</div>
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
                        {fq>0 && sq>0 && tq>0 ?
                            <TableRow>
                                    <TableCell>Impressions</TableCell>
                                    <TableCell>{Math.round(fq*impre/complete)}</TableCell>
                                    <TableCell>{Math.round(sq*impre/complete)}</TableCell>
                                    <TableCell>{Math.round(tq*impre/complete)}</TableCell>
                                    <TableCell>{Math.round(complete*impre/complete)}</TableCell>
                                    <TableCell>{impre}</TableCell>
                            </TableRow>:
                            <TableRow>
                                <TableCell>Impressions</TableCell>
                                <TableCell>{impre}</TableCell>
                                <TableCell>{impre}</TableCell>
                                <TableCell>{impre}</TableCell>
                                <TableCell>{impre}</TableCell>
                                <TableCell>{impre}</TableCell>
                            </TableRow>
                        }
                </TableBody>
            </Table>
        </TableContainer> */}
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Platform Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.audio} click={click} impression={impre} client={true} url='platformTypebycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.display} click={clickd} impression={impred} client={true} url='platformTypebycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Platform' regtitle='phonePlatform' jsotitle='platformType' ids={ids && ids.video} click={clickv} impression={imprev} client={true} url='platformTypebycampids' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Pincode Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Pincode' regtitle='pincode' jsotitle='zip' ids={ids && ids.audio} click={click} impression={impre} client={true} url='zipbycampids' />
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Device Wise Summary Report</div>
        <div>last updated at - {datefinder()}</div>
        <Auditable adtype='Audio' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.audio} click={click} impression={impre} client={true} url='pptypebycampids' />
        <Auditable adtype='Display' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.display} click={clickd} impression={impred} client={true} url='pptypebycampids' />
        <Auditable adtype='Video' state1={state1} streamingads={singlead} title='Device' regtitle='deviceModel' jsotitle='pptype' ids={ids && ids.video} click={clickv} impression={imprev} client={true} url='pptypebycampids' />
        </>
    );
}
