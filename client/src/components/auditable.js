import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, {useEffect} from 'react'
import TablePagination from "@material-ui/core/TablePagination";
import { useHistory } from 'react-router-dom';

function Auditable({streamingads,title,jsotitle,ids,url,regtitle,adtype,state1}) {
    // console.log(streamingads)
    const history = useHistory();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [adss, setadss] = React.useState([])
    useEffect(()=>{
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
                // console.log(result[0][regtitle])
                var loco = result[0][regtitle]
                loco = loco.sort(function(a,b){
                    return b.result.impression - a.result.impression;
                })
                // console.log(loco)
                setadss(loco)
            })
            .catch(err => console.log(err))
        }
    },[ids])
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
                        <TableCell>Campaign Start Date</TableCell>
                        <TableCell>Campaign End Date</TableCell>
                        <TableCell>Total Days of Campaign</TableCell>
                        <TableCell>Total Impressions Delivered till date</TableCell>
                        {(jsotitle==='region' || jsotitle==='zip' || jsotitle==='language') && <TableCell>Unique Users</TableCell>}
                        <TableCell>Total Clicks Delivered till date</TableCell>
                        <TableCell>CTR</TableCell>
                        <TableCell>Balance Days</TableCell>
                        <TableCell></TableCell>
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
                            <TableCell>{dateformatchanger(streamingads.startDate[0].slice(0,10))}</TableCell>
                            <TableCell>{dateformatchanger(streamingads.endDate[0].slice(0,10))}</TableCell>
                            <TableCell>{timefinder(streamingads.endDate[0],streamingads.startDate[0])} days</TableCell>
                            <TableCell>{row.result.impression}</TableCell>
                            {(jsotitle==='region' || jsotitle==='zip' || jsotitle==='language') && <TableCell>{row.unique}</TableCell>}
                            <TableCell>{
                                row.result.click ? row.result.click :0 + 
                                row.result.companionclicktracking ? row.result.companionclicktracking :0 + 
                                row.result.clicktracking ? row.result.clicktracking :0
                            }</TableCell>
                            <TableCell>{Math.round((row.result.click ? row.result.click :0 + 
                                row.result.companionclicktracking ? row.result.companionclicktracking :0 + 
                                row.result.clicktracking ? row.result.clicktracking :0)*100/row.result.impression *100)/100}%</TableCell>
                            <TableCell>{timefinder(streamingads.endDate[0],Date.now())} days</TableCell>
                            <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
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
