import { Button, CircularProgress, Input, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { RemoveCircleOutline } from '@material-ui/icons';
import M from 'materialize-css'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        margin: '10px auto',
        flexWrap: 'wrap',
        width: '80%',
        textAlign: 'center',
        alignItems: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    data : {
        margin: '0 20px',
        width: '20%',
    },
}));

function CampaignBundle() {
    const history = useHistory()
    const classes = useStyles();
    const {bundlename} = useParams();
    const [startDate, setstartDate] = useState('')
    const [endDate, setendDate] = useState('')
    const [bundleData, setbundleData] = useState({})
    const [bundletitle, setbundletitle] = useState('')
    const [advertiser, setadvertiser] = useState('')
    const [category, setcategory] = useState('')
    const [pricing, setpricing] = useState('')
    const [pricingmodel, setpricingmodel] = useState('')
    const [adsdata, setadsdata] = useState([]);
    const [searchedadsdata, setsearchedadsdata] = useState([]);
    const [selectedads, setselectedads] = useState([]);
    const [searchedselectedads, setsearchedselectedads] = useState([]);
    const [loadingads, setloadingads] = useState([]);
    // for editing of exisring bundle
    useEffect(()=>{
        if(bundlename){
            console.log(bundlename)
            fetch(`/bundles/title/${bundlename}`,{
                method:'get',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                setbundleData(result)
                if(result){
                    setbundletitle(result.bundleadtitle)
                    setadvertiser(result.Advertiser)
                    setcategory(result.Category)
                    setpricing(result.Pricing)
                    setpricingmodel(result.PricingModel)
                    setstartDate(result.startDate.slice(0,10))
                    setendDate(result.endDate.slice(0,10))
                    setselectedads(result.ids)
                    setsearchedselectedads(result.ids)
                    if(adsdata.length){
                        var datareq = adsdata
                        datareq = datareq.filter(x => !result.ids.includes(x))
                        setadsdata(datareq)
                        setsearchedadsdata(datareq)
                    }
                }
            }).catch(err=>console.log(err))
        }
    },[bundlename])
    // all streamingads get request
    useEffect(()=>{
        fetch('/streamingads/allads',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            if(!searchedselectedads.length){
                setadsdata(result)
                setsearchedadsdata(result)
            }else{
                var datareq = selectedads
                var d1 = result
                d1 = d1 && d1.filter(x => !datareq.includes(x))
                console.log('loaded')
                setsearchedadsdata(d1)
                setadsdata(d1)
            }
        })
    },[])
    const campaignsorter = (campagins) =>{
        var cm = campagins.sort(function(a,b){
            var d1 = new Date(a.startDate)
            var d2 = new Date(b.startDate)
            return d2 - d1;
        })
        // console.log(cm)
        return cm;
    }
    const dateformatchanger = (date) => {
        var dategot = date.toString();
        var datechanged = dategot.slice(8,10) + '-' + dategot.slice(5,7) + '-' + dategot.slice(0,4)
        return datechanged;
    }
    // adding a new bundle to database 
    const dataSender = (idstosend) => {
        fetch('/bundles/createBundle',{
            method:'post',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                Category:category,
                Advertiser:advertiser,
                bundleadtitle:bundletitle,
                ids:idstosend,
                Pricing:pricing,
                PricingModel:pricingmodel,
                endDate:endDate,
                startDate:startDate
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                return M.toast({html:result.error, classes:'#ff5252 red accent-2'})
            }
            // console.log(result.message)
            M.toast({html:result.message, classes:'#69f0ae green accent-2'})
            history.push('/manageAds')
        })
    }
    // updates the bundle data in db
    const dataUpdater = () => {
        fetch('/bundles/UpdateBundle',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                Category:category,
                Advertiser:advertiser,
                bundleadtitle:bundletitle,
                id:bundleData._id,
                Pricing:pricing,
                PricingModel:pricingmodel,
                endDate:endDate,
                startDate:startDate
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                return M.toast({html:result.error, classes:'#ff5252 red accent-2'})
            }
            // console.log(result.message)
            M.toast({html:result.message, classes:'#69f0ae green accent-2'})
            history.push('/manageAds')
        })
    }
    const adstoadd = (id,ad) => {
        if(bundlename){
            fetch('/bundles/addadtobundle',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    bundleid:bundleData._id,
                    id
                })
            }).then(res=>res.json())
            .then(response=>{
                console.log(response)
                adstoselectads(id,ad)
                loadingremover(id)
            })
            .catch(err=>console.log(err))
        }
    }
    const adstoremove = (id,ad) => {
        if(bundlename){
            fetch('/bundles/removeadtobundle',{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    bundleid:bundleData._id,
                    id
                })
            }).then(res=>res.json())
            .then(response=>{
                console.log(response)
                selectedtoads(id,ad)
                loadingremover(id)
            })
            .catch(err=>console.log(err))
        }
    }
    const adstoselectads = (id,ad) => {
        var adss = adsdata
        var adss2 = searchedadsdata
        var selectedadss = selectedads
        var selectedadss2 = searchedselectedads
        adss = adss.filter(x=>x._id!==id)
        adss2 = adss2.filter(x=>x._id!==id)
        selectedadss.push(ad)
        selectedadss2.push(ad)
        campaignsorter(adss)
        campaignsorter(adss2)
        campaignsorter(selectedadss2)
        campaignsorter(selectedadss)
        setsearchedadsdata(adss2)
        setadsdata(adss)
        setsearchedselectedads(selectedadss2)
        setselectedads(selectedadss)
    }
    const selectedtoads = (id,ad) => {
        var adss = adsdata
        var adss2 = searchedadsdata
        var selectedadss = selectedads
        var selectedadss2 = searchedselectedads
        adss.push(ad)
        adss2.push(ad)
        selectedadss = selectedadss.filter(x=>x._id!==id)
        selectedadss2 = selectedadss2.filter(x=>x._id!==id)
        campaignsorter(adss)
        campaignsorter(adss2)
        campaignsorter(selectedadss2)
        campaignsorter(selectedadss)
        setsearchedadsdata(adss2)
        setadsdata(adss)
        setsearchedselectedads(selectedadss2)
        setselectedads(selectedadss)
    }
    const loadingadder = (id) =>{
        var dataload = loadingads
        dataload.push(id)
        setloadingads(dataload)
    }
    const loadingremover = (id) =>{
        var dataload = loadingads
        dataload = dataload.filter(x=>x!==id)
        setloadingads(dataload)
    }
    return (
        <div className='dashboard'>
            <Paper style={{marginTop:'20px',padding:'50px'}}>
                <div style={{fontWeight:'bold',fontSize:'20px'}}>{bundlename ? 'Update Bundle' : 'Create a Bundle'}</div>
                <div className='titleManger'>
                    <div>Bundle Title</div>
                    <input type='text' value={bundletitle} onChange={(e)=>setbundletitle(e.target.value)} placeholder='Bundle Title' />
                </div>
                <div className='titleManger'>
                    <div>Advertiser</div>
                    <input type='text' value={advertiser} onChange={(e)=>setadvertiser(e.target.value)} placeholder='Advertiser' />
                </div>
                <div className='titleManger'>
                    <div>Category</div>
                    <input type='text' value={category} onChange={(e)=>setcategory(e.target.value)} placeholder='Category' />
                </div>
                <div className='titleManger'>
                    <div>Pricing</div>
                    <input type='text' value={pricing} onChange={(e)=>setpricing(e.target.value)} placeholder='Pricing' />
                </div>
                <div className='titleManger'>
                    <div>Pricing Model</div>
                    <input type='text' value={pricingmodel} onChange={(e)=>setpricingmodel(e.target.value)} placeholder='Pricing Model' />
                </div>
                <div className={classes.container} noValidate>
                    <div className={classes.data}>Start Date</div>
                    <TextField
                        id="date"
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e)=>setstartDate(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </div>
                <div className={classes.container} noValidate>
                    <div className={classes.data}>End Date</div>
                    <TextField
                        id="date"
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e)=>setendDate(e.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </div>
                <div>
                    <u style={{fontSize:'15px'}}>campaigns of bundled campaigns</u>
                    <div>
                        <div style={{fontSize:'15px'}}>Campaigns Selected</div>
                        <input style={{margin:'0 auto', width:'80%'}} fullWidth={true} onChange={async(e)=>{
                            var letter = e.target.value.toLowerCase()
                            // console.log(letter)
                            var campagins = selectedads;
                            campagins = await campagins.filter(x =>x.AdTitle.toLowerCase().includes(letter))
                            campaignsorter(campagins)
                            // console.log(campagins)
                            setsearchedselectedads(campagins)
                        }}  />
                        <TableContainer style={{margin:'15px auto',width:'fit-content',maxHeight:'300px',overflow:'auto'}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Ad Title</TableCell>
                                    <TableCell align='center'>Advertiser</TableCell>
                                    <TableCell align='center'>Start Date</TableCell>
                                    <TableCell align='center'>End Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchedselectedads && searchedselectedads.map((ad,i)=>{
                                    return (<TableRow key={i}>
                                        <TableCell align='center' style={{width:'30%'}}>{ad.AdTitle}</TableCell>
                                        <TableCell align='center' style={{width:'20%'}}>{ad.Advertiser}</TableCell>
                                        <TableCell align='center'>{dateformatchanger(ad.startDate)}</TableCell>
                                        <TableCell align='center'>{dateformatchanger(ad.endDate)}</TableCell>
                                        {!loadingads.includes(ad._id) ? <TableCell style={{cursor:'pointer'}}
                                            onClick={()=>{
                                                loadingadder(ad._id)
                                                if(bundlename){
                                                    adstoremove(ad._id,ad)
                                                }else{
                                                    selectedtoads(ad._id,ad)
                                                    loadingremover(ad._id)
                                                }
                                            }}
                                        ><RemoveCircleOutline /></TableCell>:
                                        <TableCell><CircularProgress color="secondary" /></TableCell>}
                                    </TableRow>);
                                })}
                                {!searchedselectedads.length && (<TableRow><TableCell>Campagins needed to be selected</TableCell></TableRow>)}
                            </TableBody>
                        </TableContainer>
                        <div style={{fontSize:'15px'}}>Campaigns list</div>
                        <input style={{margin:'0 auto', width:'80%'}} placeholder='Search the Campagins' onChange={async(e)=>{
                            var letter = e.target.value.toLowerCase()
                            // console.log(letter)
                            var campagins = adsdata;
                            campagins = await campagins.filter(x =>x.AdTitle.toLowerCase().includes(letter))
                            campaignsorter(campagins)
                            // console.log(campagins)
                            setsearchedadsdata(campagins)
                        }} />
                        <TableContainer  style={{margin:'15px auto',width:'fit-content',maxHeight:'350px',overflow:'auto'}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Ad Title</TableCell>
                                    <TableCell align='center'>Advertiser</TableCell>
                                    <TableCell align='center'>Start Date</TableCell>
                                    <TableCell align='center'>End Date</TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchedadsdata && searchedadsdata.map((ad,i)=>{
                                    return (<TableRow key={i}>
                                        <TableCell align='center' style={{width:'30%'}}>{ad.AdTitle}</TableCell>
                                        <TableCell align='center' style={{width:'20%'}}>{ad.Advertiser}</TableCell>
                                        <TableCell align='center'>{dateformatchanger(ad.startDate)}</TableCell>
                                        <TableCell align='center'>{dateformatchanger(ad.endDate)}</TableCell>
                                        {!loadingads.includes(ad._id) ? <TableCell
                                            onClick={()=>{
                                                var dataload = loadingads
                                                dataload.push(ad._id)
                                                setloadingads(dataload)
                                                if(bundlename){
                                                    adstoadd(ad._id,ad)
                                                }else{
                                                    adstoselectads(ad._id,ad)
                                                    loadingremover(ad._id)
                                                }
                                            }}
                                            style={{cursor:'pointer',fontSize:'30px'}}>+</TableCell>
                                        : <TableCell><CircularProgress color="secondary" /></TableCell>}
                                    </TableRow>);
                                })}
                                {!searchedadsdata.length && (<TableRow><TableCell>Campagins are loading or no data found</TableCell></TableRow>)}
                            </TableBody>
                        </TableContainer>
                    </div>
                    {/* <button className='btn' color='primary'>Submit</button> */}
                    <Button className='btn' onClick={()=>{
                        var data = selectedads
                        data = data.map(ad=>{
                            return ad._id
                        })
                        console.log(data)
                        if(bundlename){
                            dataUpdater()
                        }else{
                            dataSender(data)
                        }
                    }} style={{backgroundColor:'#1a75ff',color:'whitesmoke'}}>{bundlename ? 'Update Bundle' : 'Submit'}</Button>
                </div>
            </Paper>
        </div>
    )
}

export default CampaignBundle