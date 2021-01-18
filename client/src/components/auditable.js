import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, {useEffect} from 'react'
import TablePagination from "@material-ui/core/TablePagination";
import { useHistory } from 'react-router-dom';

function Auditable({streamingads,title,jsotitle,ids,url,regtitle,adtype,state1,client,ratio,impression,click}) {
    // console.log(streamingads)
    const history = useHistory();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [totalimpre, settotalimpre] = React.useState(0);
    const [totalclick, settotalclick] = React.useState(0);
    const [adss, setadss] = React.useState([])
    useEffect(()=>{
        console.log(ids,url,adtype)
        if(ids){
            fetch(`/report/${url}`,{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    campaignId:ids
                })
            }).then(res=>res.json())
            .then(result => {
                // console.log(result,url)
                var loco = result[0][regtitle]
                loco = loco.sort(function(a,b){
                    return b.result.impression - a.result.impression;
                })
                var totimpre = 0;
                var totclick = 0;
                loco.map(a=>{
                    totimpre += a.result.impression ? parseInt(a.result.impression) :0
                    totclick += a.result.click ? a.result.click :0 + 
                    a.result.companionclicktracking ? a.result.companionclicktracking :0 + 
                    a.result.clicktracking ? a.result.clicktracking :0;
                })
                // console.log(typeof impression, impression)
                // console.log(totimpre)
                settotalimpre(totimpre)
                settotalclick(totclick)
                // console.log(loco)
                setadss(loco)
            })
            .catch(err => console.log(err))
        }
    },[ids])
    // console.log(impression,url,adtype)
    // useEffect(()=>{
    //     console.log(impression,totalimpre,url,impression/totalimpre,adtype)
    // },[totalimpre,impression])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
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
        <Paper>
            <div style={{margin:'5px',fontWeight:'bolder'}}>{adtype} Type</div>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>  
                        <TableCell>{title}</TableCell>
                        {!client &&  <TableCell>Campaign Start Date</TableCell>}
                        {!client &&  <TableCell>Campaign End Date</TableCell>}
                        {!client &&  <TableCell>Total Days of Campaign</TableCell>}
                        <TableCell>Total Impressions Delivered till date</TableCell>
                        {(jsotitle==='region' || jsotitle==='zip' || jsotitle==='language') && <TableCell>Unique Users</TableCell>}
                        <TableCell>Total Clicks Delivered till date</TableCell>
                        <TableCell>CTR</TableCell>
                        {!client &&  <TableCell>Balance Days</TableCell>}
                        {!client &&  <TableCell></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {adss && adss.length >= 1 ? adss
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row,i) =>{ 
                        if(typeof row !== 'undefined'){
                        if(row[jsotitle] && row[jsotitle] !== " - " && row[jsotitle] && row[jsotitle] !== undefined){
                        return (
                        <TableRow key ={i} hover role="checkbox" tabIndex={-1} key={row._id}>
                            <TableCell>{row[jsotitle]}</TableCell>
                            {!client && <TableCell>{dateformatchanger(streamingads.startDate[0].slice(0,10))}</TableCell>}
                            {!client && <TableCell>{dateformatchanger(streamingads.endDate[0].slice(0,10))}</TableCell>}
                            {!client && <TableCell>{timefinder(streamingads.endDate[0],streamingads.startDate[0])} days</TableCell>}
                            {client? <TableCell>{Math.round(impression*row.result.impression/totalimpre)}</TableCell> : <TableCell>{row.result.impression}</TableCell>}
                            {(jsotitle==='region' || jsotitle==='zip' || jsotitle==='language') && <TableCell>{
                                ratio ? (Math.round(ratio*row.result.impression) + 1) : row.unique
                            }</TableCell>}
                            <TableCell>{
                                click ?
                                Math.round(click*(row.result.click ? (row.result.click) :0 + 
                                row.result.companionclicktracking ? row.result.companionclicktracking :0 + 
                                row.result.clicktracking ? row.result.clicktracking :0)/totalclick) :
                                Math.round(row.result.click ? (row.result.click) :0 + 
                                row.result.companionclicktracking ? row.result.companionclicktracking :0 + 
                                row.result.clicktracking ? row.result.clicktracking :0)
                            }</TableCell>
                            <TableCell>{
                                impression ?
                                Math.round(((row.result.click ? row.result.click :0 + 
                                row.result.companionclicktracking ? row.result.companionclicktracking :0 + 
                                row.result.clicktracking ? row.result.clicktracking :0)*click/totalclick)*100/(impression*row.result.impression/totalimpre) *100)/100 :
                                Math.round((row.result.click ? row.result.click :0 + 
                                row.result.companionclicktracking ? row.result.companionclicktracking :0 + 
                                row.result.clicktracking ? row.result.clicktracking :0)*100/(row.result.impression) *100)/100 }%</TableCell>
                            {!client &&  <TableCell>{timefinder(streamingads.endDate[0],Date.now())} days</TableCell>}
                            {!client &&  <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>}
                        </TableRow>
                        );}}else{
                            return (<TableRow><TableCell>No aaads to display</TableCell></TableRow>)
                        }
                    }) : <TableRow><TableCell>No ads to display</TableCell></TableRow>}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25,100,1000,10000]}
                component="div"
                count={adss ? adss.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default Auditable
