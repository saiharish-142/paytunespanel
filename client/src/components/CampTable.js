import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { useHistory } from "react-router-dom";
import { IdContext } from '../App'
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';

const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    container: {
        maxHeight: 440
    }
});

export default function StickyHeadTable({streamingads,settingcamp,clientview}) {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [sa, setsa] = useState('remain')
    const [adss, setadss] = useState(streamingads)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {state1,dispatch1} = useContext(IdContext)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const dateformatchanger = (date) => {
        var dategot = date.toString();
        var datechanged = dategot.slice(8,10) + '-' + dategot.slice(5,7) + '-' + dategot.slice(0,4)
        return datechanged;
    }
    useEffect(() => {
        setadss(streamingads)
        campaignssorter(sa)
    }, [streamingads])
    useEffect(() => {
        campaignssorter(sa)
        // console.log('changed')
    }, [adss])
    useEffect(() => {
        // console.log(sa)
    }, [sa])
    const campaignssorter = (cmd) => {
        var datareq = streamingads;
        if(cmd === 'start'){
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.startDate[0])
                var d2 = new Date(b.startDate[0])
                return d2 - d1;
            })
            // console.log(datareq)
            setsa('start')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd === 'end'){
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.endDate[0])
                var d2 = new Date(b.endDate[0])
                return d2 - d1;
            })
            setsa('end')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd === 'create'){
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.createdOn)
                var d2 = new Date(b.createdOn)
                return d2 - d1;
            })
            setsa('create')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'cat'){
            datareq = datareq.sort(function(a,b){
                var aa = a.Adtitle === "" ? null : a.Adtitle;
                var ba = b.Adtitle === "" ? null : b.Adtitle;
                if(aa < ba) { return -1; }
                if(aa > ba) { return 1; }
                return 0;
            })
            setsa('cat')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'adv'){
            datareq = datareq.sort(function(a,b){
                var aa = a.Advertiser ?a.Advertiser : null;
                var ba = b.Advertiser ?b.Advertiser : null;
                if(aa < ba) { return -1; }
                if(aa > ba) { return 1; }
                return 0;
            })
            setsa('adv')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'pri'){
            datareq = datareq.sort(function(a,b){
                var aa = a.Pricing;
                var ba = b.Pricing;
                if(aa < ba) { return -1; }
                if(aa > ba) { return 1; }
                return 0;
            })
            setsa('pri')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'RO'){
            datareq = datareq.sort(function(a,b){
                if(a.ro < b.ro) { return -1; }
                if(a.ro > b.ro) { return 1; }
                return 0;
            })
            setsa('RO')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'pm'){
            datareq = datareq.sort(function(b,a){
                var aa = a.PricingModel === "" ? null : a.PricingModel;
                var ba = b.PricingModel === "" ? null : b.PricingModel;
                if(aa < ba) { return -1; }
                if(aa > ba) { return 1; }
                return 0;
            })
            setsa('pm')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'cag'){
            datareq = datareq.sort(function(a,b){
                var aa = a.Category === "" ? null : a.Category;
                var ba = b.Category === "" ? null : b.Category;
                if(ba < aa) { return -1; }
                if(ba > aa) { return 1; }
                return 0;
            })
            setsa('cag')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'remain'){
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.endDate[0])
                var d2 = new Date(Date.now())
                // console.log(d1,d2)
                var aa = d1.getTime() - d2.getTime();
                if(d1<d2){
                    aa = null;
                }
                var db1 = new Date(b.endDate[0])
                var db2 = new Date(Date.now())
                // console.log(d1,d2)
                var ba = db1.getTime() - db2.getTime();
                if(d1<d2){
                    ba = null;
                }
                if(ba < aa) { return 1; }
                if(ba > aa) { return -1; }
                return 0;
            })
            setsa('remain')
            setadss(datareq)
            settingcamp(datareq)
        }
        if(cmd=== 'revremain'){
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.endDate[0])
                var d2 = new Date(Date.now())
                // console.log(d1,d2)
                var aa = d1.getTime() - d2.getTime();
                if(d1<d2){
                    aa = null;
                }
                var db1 = new Date(b.endDate[0])
                var db2 = new Date(Date.now())
                // console.log(d1,d2)
                var ba = db1.getTime() - db2.getTime();
                if(d1<d2){
                    ba = null;
                }
                if(ba < aa) { return -1; }
                if(ba > aa) { return 1; }
                return 0;
            })
            setsa('revremain')
            setadss(datareq)
            settingcamp(datareq)
        }
    }
    const timefinder = (da1) => {
        var d1 = new Date(da1)
        var d2 = new Date(Date.now())
        // console.log(d1,d2)
        if(d1<d2){
            return 'completed campaign'
        }
        var show = d1.getTime() - d2.getTime();
        var resula = show/(1000 * 3600 * 24) ;
        return Math.round(resula*1)/1 ;
    }
    return (
        <Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                    <TableCell align='left' onClick={()=>campaignssorter('cat')} style={{cursor:'pointer'}}>Name {sa==='cat' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='left' onClick={()=>campaignssorter('adv')} style={{cursor:'pointer'}}>Advertiser {sa==='adv' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('pri')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Pricing {sa==='pri' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('RO')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>RO from Advertiser {sa==='RO' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('pm')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Pricing Model {sa==='pm' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('cag')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Category {sa==='cag' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('create')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Created On {sa==='create' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('start')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Start Date {sa==='start' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onClick={()=>campaignssorter('end')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>End Date {sa==='end' &&  <ArrowUpwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell align='center' onDoubleClick={()=>campaignssorter('revremain')} onClick={()=>campaignssorter('remain')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Remaining Days {sa==='remain' &&  <ArrowUpwardRoundedIcon fontSize="small" />}{sa==='revremain' &&  <ArrowDownwardRoundedIcon fontSize="small" />}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {adss.length >= 1 ? adss
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) =>{ 
                    if(typeof row !== 'undefined'){
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        <TableCell align='left'>{row.Adtitle && row.Adtitle}</TableCell>
                        <TableCell align='left'>{row.Advertiser && row.Advertiser}</TableCell>
                        <TableCell align='center'>{row.Pricing && row.Pricing}</TableCell>
                        <TableCell align='center'>{row.ro && row.ro}</TableCell>
                        <TableCell align='center'>{row.PricingModel && row.PricingModel}</TableCell>
                        <TableCell align='center'>{row.Category && row.Category}</TableCell>
                        <TableCell align='center'>{row.createdOn ? dateformatchanger(row.createdOn.substring(0,10)) : dateformatchanger(row.createdAt.substring(0,10))}</TableCell>
                        <TableCell align='center'>{row.startDate && dateformatchanger(row.startDate[0])}</TableCell>
                        <TableCell align='center'>{row.endDate && dateformatchanger(row.endDate[0])}</TableCell>
                        <TableCell align='center'>{row.endDate&& timefinder(row.endDate[0])} days</TableCell>
                        <TableCell align='center' className='mangeads__report' onClick={()=>{
                            if(clientview){
                                history.push(`/clientSideCamp/${row._id}`)
                            }else{
                                history.push(`/manageAds/${row._id}`)
                            }
                            dispatch1({type:"ID",payload:row._id})
                        }}>Report</TableCell>
                    </TableRow>
                    );}else{
                        return (<TableRow><TableCell>No aaads to display</TableCell></TableRow>)
                    }
                }) : <TableRow><TableCell>No ads to display</TableCell></TableRow>}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={adss.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </Paper>
    );
}
