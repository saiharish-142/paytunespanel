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
import EditIcon from '@material-ui/icons/Edit';

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
    const {dispatch1} = useContext(IdContext)
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
    const tablesorter = (title,order,type,coloumn,isZero) =>{
        var datareq = streamingads;
        console.log(order)
        if(order===1){
            datareq = datareq.sort(function(a,b){
                if(type==='date'){
                    if(isZero){
                        var d1 = new Date(a[coloumn][0])
                        var d2 = new Date(b[coloumn][0])
                    }else{
                        var d1 = new Date(a[coloumn])
                        var d2 = new Date(b[coloumn])
                    }
                    return d2 - d1;
                }else{
                    var aa = a[coloumn] ?a[coloumn] : null;
                    var ba = b[coloumn] ?b[coloumn] : null;
                    if(aa < ba) { return -1; }
                    if(aa > ba) { return 1; }
                    return 0;
                }
            })
        }else{
            datareq = datareq.sort(function(a,b){
                if(type==='date'){
                    if(isZero){
                        var d1 = new Date(a[coloumn][0])
                        var d2 = new Date(b[coloumn][0])
                    }else{
                        var d1 = new Date(a[coloumn])
                        var d2 = new Date(b[coloumn])
                    }
                    return d1 - d2;
                }else{
                    var aa = a[coloumn] ? a[coloumn] : null;
                    var ba = b[coloumn] ? b[coloumn] : null;
                    if(aa < ba) { return 1; }
                    if(aa > ba) { return -1; }
                    return 0;
                }
            })
        }
        // console.log(datareq)
        setsa(title)
        setadss(datareq)
        settingcamp(datareq)
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
    const arrowRetuner = (mode) =>{
        if(mode==='1'){
            return <ArrowUpwardRoundedIcon fontSize="small" />
        }else if(mode==='2'){
            return <ArrowDownwardRoundedIcon fontSize="small" />
        }else{
            return <ArrowUpwardRoundedIcon fontSize="small" style={{color:'lightgrey'}} />
        }
    }
    return (
        <>
        <Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                    <TableCell align='left' onClick={()=>tablesorter('cat',1,'notdate','Adtitle',false)} onDoubleClick={()=>tablesorter('revcat',-1,'notdate','Adtitle',false)} style={{cursor:'pointer'}}>Name {arrowRetuner(sa==='cat' ? '1' : (sa ==='revcat' ? '2' : '3' ))}</TableCell>
                    <TableCell align='left' onClick={()=>tablesorter('adv',1,'notdate','Advertiser',false)} onDoubleClick={()=>tablesorter('revadv',-1,'notdate','Advertiser',false)} style={{cursor:'pointer'}}>Advertiser {arrowRetuner(sa==='adv' ? '1' : (sa ==='revadv' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('pri',1,'notdate','Pricing',false)} onDoubleClick={()=>tablesorter('revpri',-1,'notdate','Pricing',false)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Pricing {arrowRetuner(sa==='pri' ? '1' : (sa ==='revpri' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('RO',1,'notdate','ro',false)} onDoubleClick={()=>tablesorter('revRO',-1,'notdate','ro',false)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>RO from Advertiser {arrowRetuner(sa==='RO' ? '1' : (sa ==='revRO' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('pm',1,'notdate','PricingModel',false)} onDoubleClick={()=>tablesorter('revpm',-1,'notdate','PricingModel',false)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Pricing Model {arrowRetuner(sa==='pm' ? '1' : (sa ==='revpm' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('cag',1,'notdate','Category',false)} onDoubleClick={()=>tablesorter('revcag',-1,'notdate','Category',false)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Category {arrowRetuner(sa==='cag' ? '1' : (sa ==='recag' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('create',1,'date','createdOn',false)} onDoubleClick={()=>tablesorter('revcreate',-1,'date','createdOn',false)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Created On {arrowRetuner(sa==='create' ? '1' : (sa ==='revcreate' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('start',1,'date','startDate',true)} onDoubleClick={()=>tablesorter('revstart',-1,'date','startDate',true)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Start Date {arrowRetuner(sa==='start' ? '1' : (sa ==='revstart' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onClick={()=>tablesorter('end',1,'date','endDate',true)} onDoubleClick={()=>tablesorter('revend',-1,'date','endDate',true)} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>End Date {arrowRetuner(sa==='end' ? '1' : (sa ==='revend' ? '2' : '3' ))}</TableCell>
                    <TableCell align='center' onDoubleClick={()=>campaignssorter('revremain')} onClick={()=>campaignssorter('remain')} style={{textAlign:'center',alignItems:'center',cursor:'pointer'}}>Remaining Days {arrowRetuner(sa==='remain' ? '1' : (sa ==='revremain' ? '2' : '3' ))}</TableCell>
                        {!clientview && <TableCell></TableCell>}
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
        </>
    );
}
