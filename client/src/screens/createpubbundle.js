import {
    Button,
    CircularProgress,
    Input,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import { RemoveCircleOutline } from '@material-ui/icons';
import M from 'materialize-css';


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        margin: '10px auto',
        flexWrap: 'wrap',
        width: '80%',
        textAlign: 'center',
        alignItems: 'center'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    data: {
        margin: '0 20px',
        width: '20%'
    }
}));

function PublisherBundle() {
    const history = useHistory();
    const classes = useStyles();
    const { bundlename } = useParams();
    const [bundleData, setbundleData] = useState({});
    const [pubdata, setpubdata] = useState([]);
    const [selectedpubdata, setselectedpubdata] = useState([]);
    const [searchedselectedpubdata, setsearchedselectedpubdata] = useState([]);
    const [searchedpubdata, setsearchedpubdata] = useState([]);
    const [bundletitle, setbundletitle] = useState('');
    const [adsdata, setadsdata] = useState([]);
    const [searchedadsdata, setsearchedadsdata] = useState([]);
    const [selectedads, setselectedads] = useState([]);
    const [searchedselectedads, setsearchedselectedads] = useState([]);
    const [loadingads, setloadingads] = useState([]);
    // for editing of exisring bundle
    useEffect(
        () => {
            if (bundlename) {
                console.log(bundlename);
                fetch(`/bundles/pub/${bundlename}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('jwt')
                    }
                })
                    .then((res) => res.json())
                    .then((result) => {
                        console.log('3423',result);
                        setbundleData(result.data);
                        if (result) {
                            console.log('34244');
                            setbundletitle(result.data.bundletitle);
                            // setpubdata(result.pubdata);
                            setselectedpubdata(result.data.pubdata);
                            // setsearchedpubdata(result.pubdata);
                            setsearchedselectedpubdata(result.data.pubdata);
                            // if (pubdata.length) {
                            //     var datareq = pubdata;
                            //     datareq = datareq.filter((x) => !result.pubdata.includes(x));
                            //     setadsdata(datareq);
                            //     setsearchedadsdata(datareq);
                            // }
                        }
                    })
                    .catch((err) => console.log(err));
            }
        },
        [bundlename]
    );
    // all publishers get request
    useEffect(() => {
        fetch('/bundles/allpub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.error) {
                    console.log(result.error);
                }

                if (!searchedselectedpubdata.length) {
                    console.log(12)
                    setpubdata(result.data);
                    setsearchedpubdata(result.data);
                } else {
                    // console.log(11);
                    // let datareq = selectedpubdata;
                    // let d1 = result.data;
                    // let filtered = d1.filter(x => !datareq.includes(x));
                    // console.log(filtered)
                    // setpubdata(filtered);
                    // setsearchedpubdata(filtered);
                }
                // console.log(result)
                // if (!searchedselectedads.length) {
                //     setadsdata(result);
                //     setsearchedadsdata(result);
                // } else {
                //     var datareq = selectedads;
                //     var d1 = result;
                //     d1 = d1 && d1.filter((x) => !datareq.includes(x));
                //     console.log('loaded');
                //     setsearchedadsdata(d1);
                //     setadsdata(d1);
                // }
            }).catch(err=>console.log(err))  ;
    }, []);
    //
    // useEffect(() => {
    //     var data = searchedadsdata
    //     var d = searchedselectedads
    //     data = [...new Set(data)];
    //     data = data.filter(x => !d.includes(x))
    //     setsearchedadsdata(data)
    // }, [searchedadsdata]);
    // useEffect(() => {
    //     var data = adsdata
    //     var d = selectedads
    //     data = [...new Set(data)];
    //     data = data.filter(x => !d.includes(x))
    //     setadsdata(data)
    // }, [adsdata]);
    const campaignsorter = (campagins) => {
        var cm = campagins.sort(function (a, b) {
            var d1 = new Date(a.startDate);
            var d2 = new Date(b.startDate);
            return d2 - d1;
        });
        // console.log(cm)
        return cm;
    };
    const dateformatchanger = (date) => {
        var dategot = date.toString();
        var datechanged = dategot.slice(8, 10) + '-' + dategot.slice(5, 7) + '-' + dategot.slice(0, 4);
        return datechanged;
    };
    // adding a new bundle to database
    const dataSender = (ids) => {
        fetch('/bundles/createpubBundle', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                bundletitle,
                pubids:ids
            })
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.error) {
                    return M.toast({ html: result.error, classes: '#ff5252 red accent-2' });
                }
                // console.log(result.message)
                M.toast({ html: result.message, classes: '#69f0ae green accent-2' });
                history.push('/manageAds');
            });
    };
    // updates the bundle data in db
    const dataUpdater = (id,data) => {
        console.log(id);
        fetch('/bundles/UpdatepubBundle', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                bundletitle,
                orgpubname:id,
                finalpubname:data
                // Category: category,
                // Advertiser: advertiser,
                // bundleadtitle: bundletitle,
                // id: bundleData._id,
                // Pricing: pricing,
                // PricingModel: pricingmodel,
                // endDate: endDate,
                // startDate: startDate
            })
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.error) {
                    return M.toast({ html: result.error, classes: '#ff5252 red accent-2' });
                }
                // console.log(result.message)
                M.toast({ html: result.message, classes: '#69f0ae green accent-2' });
                history.push('/manageAds');
            });
    };

    const filterpubdata=(ad)=>{
        let results=pubdata.filter((pub)=>pub!==ad);
        setsearchedpubdata(results);
        setpubdata(results);
    }
    // const adstoadd = (id, ad) => {  Restaurant Rivals: Free Restaurant Games Offline
    //     if (bundlename) {
    //         fetch('/bundles/addadtobundle', {
    //             method: 'put',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: 'Bearer ' + localStorage.getItem('jwt')
    //             },
    //             body: JSON.stringify({
    //                 bundleid: bundleData._id,
    //                 id
    //             })
    //         })
    //             .then((res) => res.json())
    //             .then((response) => {
    //                 console.log(response);
    //                 adstoselectads(id, ad);
    //                 loadingremover(id);
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // };

    const removeselectedpubs = (ad) => {
        let data = selectedpubdata;
        let filtered = data.filter(x => x !== ad);
        setselectedpubdata(filtered);
        setsearchedselectedpubdata(filtered);
        setsearchedpubdata([...pubdata,ad]);
        setpubdata([...pubdata,ad]);
    }

    // const adstoremove = (id, ad) => {
    //     if (bundlename) {
    //         fetch('/bundles/removeadtobundle', {
    //             method: 'put',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: 'Bearer ' + localStorage.getItem('jwt')
    //             },
    //             body: JSON.stringify({
    //                 bundleid: bundleData._id,
    //                 id
    //             })
    //         })
    //             .then((res) => res.json())
    //             .then((response) => {
    //                 console.log(response);
    //                 selectedtoads(id, ad);
    //                 loadingremover(id);
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // };
    // const adstoselectads = (id, ad) => {
    //     var adss = adsdata;
    //     var adss2 = searchedadsdata;
    //     var selectedadss = selectedads;
    //     var selectedadss2 = searchedselectedads;
    //     adss = adss.filter((x) => x._id !== id);
    //     adss2 = adss2.filter((x) => x._id !== id);
    //     selectedadss.push(ad);
    //     selectedadss2.push(ad);
    //     campaignsorter(adss);
    //     campaignsorter(adss2);
    //     campaignsorter(selectedadss2);
    //     campaignsorter(selectedadss);
    //     adss = [...new Set(adss)];
    //     adss2 = [...new Set(adss2)];
    //     selectedadss = [...new Set(selectedadss)];
    //     selectedadss2 = [...new Set(selectedadss2)];
    //     setsearchedadsdata(adss2);
    //     setadsdata(adss);
    //     setsearchedselectedads(selectedadss2);
    //     setselectedads(selectedadss);
    // };
    // const selectedtoads = (id, ad) => {
    //     var adss = adsdata;
    //     var adss2 = searchedadsdata;
    //     var selectedadss = selectedads;
    //     var selectedadss2 = searchedselectedads;
    //     adss.push(ad);
    //     adss2.push(ad);
    //     selectedadss = selectedadss.filter((x) => x._id !== id);
    //     selectedadss2 = selectedadss2.filter((x) => x._id !== id);
    //     campaignsorter(adss);
    //     campaignsorter(adss2);
    //     campaignsorter(selectedadss2);
    //     campaignsorter(selectedadss);
    //     adss = [...new Set(adss)];
    //     adss2 = [...new Set(adss2)];
    //     selectedadss = [...new Set(selectedadss)];
    //     selectedadss2 = [...new Set(selectedadss2)];
    //     setsearchedadsdata(adss2);
    //     setadsdata(adss);
    //     setsearchedselectedads(selectedadss2);
    //     setselectedads(selectedadss);
    // };
    // const loadingadder = (id) => {
    //     var dataload = loadingads;
    //     dataload.push(id);
    //     setloadingads(dataload);
    // };
    const loadingremover = (id) => {
        var dataload = loadingads;
        dataload = dataload.filter((x) => x !== id);
        setloadingads(dataload);
    };
    return (
        <div className="dashboard">
            <Paper style={{ marginTop: '20px', padding: '50px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    {bundlename ? 'Update Bundle' : 'Create a Bundle'}
                </div>
                <div className="titleManger">
                    <div>Pub Bundle Title</div>
                    <input
                        type="text"
                        value={bundletitle}
                        onChange={(e) => setbundletitle(e.target.value)}
                        placeholder="Bundle Title"
                    />
                </div>

                <div>
                    <u style={{ fontSize: '15px' }}>Publishers of Bundled Campaigns</u>
                    <div>
                        <div style={{ fontSize: '15px' }}>Publishers Selected</div>
                        <input
                            style={{ margin: '0 auto', width: '80%' }}
                            fullWidth={true}
                            onChange={ (e) => {
                                var letter = e.target.value.toLowerCase();
                                // console.log(letter)
                                var campagins = selectedpubdata;
                                campagins = campagins.filter((x) => x.publishername.toLowerCase().includes(letter));
                                setsearchedselectedpubdata(campagins);
                            }}
                        />
                        <TableContainer
                            style={{ margin: '15px auto', width: 'fit-content', maxHeight: '300px', overflow: 'auto' }}
                        >
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell align="center">Ad Title</TableCell> */}
                                    <TableCell align="center">PublisherId</TableCell>
                                    <TableCell align="center">Publisher Name</TableCell>
                                    <TableCell align="center">SSP</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchedselectedpubdata &&
                                    searchedselectedpubdata.map((ad, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell align="center" style={{ width: '20%' }}>
                                                    {ad.publisherid}
                                                </TableCell>
                                                <TableCell align="center" style={{ width: '20%' }}>
                                                    {ad.publishername}
                                                </TableCell>
                                                <TableCell align="center" style={{ width: '20%' }}>
                                                    {ad.ssp}
                                                </TableCell>
                                                {/* {!loadingads.includes(ad._id) ? ( */}
                                                <TableCell
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        removeselectedpubs(ad);
                                                        // loadingadder(ad._id);
                                                        // if (bundlename) {
                                                        //     adstoremove(ad._id, ad);
                                                        // } else {
                                                        //     selectedtoads(ad._id, ad);
                                                        //     loadingremover(ad._id);
                                                        // }
                                                    }}
                                                >
                                                    <RemoveCircleOutline />
                                                </TableCell>
                                                {/* ) : (
                                                    <TableCell>
                                                        <CircularProgress color="secondary" />
                                                    </TableCell>
                                                )} */}
                                            </TableRow>
                                        );
                                    })}
                                {!searchedselectedpubdata.length && (
                                    <TableRow>
                                        <TableCell>Publishers needed to be selected</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </TableContainer>
                        <div style={{ fontSize: '15px' }}>Publishers list</div>
                        <input
                            style={{ margin: '0 auto', width: '80%' }}
                            placeholder="Search the Publishers"
                            onChange={async (e) => {
                                var letter = e.target.value.toLowerCase();
                                // console.log(letter)
                                var campagins = pubdata;
                                campagins = campagins.filter((x) => x.publishername.toLowerCase().includes(letter));
                                // console.log(campagins)
                                setsearchedpubdata(campagins);
                            }}
                        />
                        <TableContainer
                            style={{ margin: '15px auto', width: 'fit-content', maxHeight: '350px', overflow: 'auto' }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">PublisherId</TableCell>
                                    <TableCell align="center">Publisher Name</TableCell>
                                    <TableCell align="center">SSP</TableCell>

                                    <TableCell align="center" />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchedpubdata &&
                                    searchedpubdata.map((ad, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell align="center" style={{ maxWidth: '20%' }}>
                                                    {ad.publisherid}
                                                </TableCell>
                                                <TableCell align="center" style={{ maxWidth: '20%' }}>
                                                    {ad.publishername}
                                                </TableCell>
                                                <TableCell align="center" style={{ maxWidth: '20%' }}>
                                                    {ad.ssp}
                                                </TableCell>
                                                
                                                {/* {!loadingads.includes(ad._id) ? ( */}
                                                    <TableCell
                                                        onClick={() => {
                                                            setsearchedselectedpubdata([...searchedselectedpubdata,ad]);
                                                            setselectedpubdata([...selectedpubdata,ad]);
                                                            filterpubdata(ad);
                                                            // var dataload = loadingads;
                                                            // dataload.push(ad._id);
                                                            // setloadingads(dataload);
                                                            // if (bundlename) {
                                                            //     adstoadd(ad._id, ad);
                                                            // } else {
                                                            //     adstoselectads(ad._id, ad);
                                                            //     loadingremover(ad._id);
                                                            // }
                                                        }}
                                                        style={{ cursor: 'pointer', fontSize: '30px' }}
                                                    >
                                                        +
                                                    </TableCell>
                                                {/* // ) : (
                                                //     <TableCell>
                                                //         <CircularProgress color="secondary" />
                                                //     </TableCell>
                                                // )} */}
                                            </TableRow>
                                        );
                                    })}
                                {!searchedpubdata.length && (
                                    <TableRow>
                                        <TableCell>Campagins are loading or no data found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </TableContainer>
                    </div>
                    {/* <button className='btn' color='primary'>Submit</button> */}
                    <Button
                        className="btn"
                        onClick={() => {
                            
                            var data = selectedpubdata;
                            console.log(data)
                            data = data.map((ad) => {
                                return {publishername:ad.publishername,publisherid:ad.publisherid};
                            });
                            console.log(data);
                            if (bundlename) {
                                let id=bundleData.pubdata.map(data=>
                                    {
                                        let result= {publishername:data.publishername,publisherid:data.publisherid}
                                        return result;
                                    }
                                    );
                                dataUpdater(id,data);
                            } else {
                                dataSender(data);
                            }
                        }}
                        style={{ backgroundColor: '#1a75ff', color: 'whitesmoke' }}
                    >
                        {bundlename ? 'Update Bundle' : 'Submit'}
                    </Button>
                </div>
            </Paper>
        </div>
    );
}

export default PublisherBundle;
