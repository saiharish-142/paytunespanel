import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react'

function Auditable({streamingads,title,jsotitle,ids,url,adtype}) {
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [adss, setadss] = React.useState(streamingads)
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
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>{title}</TableCell>
                        <TableCell>Campaign Start Date</TableCell>
                        <TableCell>Campaign End Date</TableCell>
                        <TableCell>Total Days of Campaign</TableCell>
                        <TableCell>Total Impressions Delivered till date</TableCell>
                        <TableCell>Total Clicks Delivered till date</TableCell>
                        <TableCell>CTR</TableCell>
                        <TableCell>Balance Days</TableCell>
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
                            <TableCell>{log[jsotitle]}</TableCell>
                            <TableCell>{dateformatchanger(log.campaignId.startDate.slice(0,10))}</TableCell>
                            <TableCell>{dateformatchanger(log.campaignId.endDate.slice(0,10))}</TableCell>
                            <TableCell>{timefinder(log.campaignId.endDate,log.campaignId.startDate)} days</TableCell>
                            <TableCell>{log.impressions}</TableCell>
                            <TableCell>{log.clicks}</TableCell>
                            <TableCell>{Math.round(log.clicks*100/log.impressions *100)/100}%</TableCell>
                            <TableCell>{timefinder(log.campaignId.endDate,Date.now())} days</TableCell>
                            <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
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
    )
}

export default Auditable
