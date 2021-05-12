import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, {useEffect} from 'react'
import TablePagination from "@material-ui/core/TablePagination";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function FrequencyAdmin({title,report,state1}) {
    const history = useHistory();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [adss, setadss] = React.useState(report)
    useEffect(() => {
        if(report && report.length >0){
            setadss(report)
        }else{
            setadss(report)
        }
    }, [report])
    const classes = useStyles();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // console.log(adss && adss.length ? 'data' : 'no data')
    return (
        <Paper>
            <TableContainer style={{margin:'20px 0'}}>
                <div style={{margin:'5px',fontWeight:'bolder'}}>{title} Report</div>
                {adss && adss.length > 0 ?
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Frequency</TableCell>
                                {adss && adss.map((x,i)=>{
                                    return <TableCell key={i}>{x._id}</TableCell>
                                })}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                <TableRow>
                                    <TableCell>Impression Count</TableCell>
                                    {adss && adss.map((x,i)=>{
                                        return <TableCell key={i}>{x.freq}</TableCell>
                                    })}
                                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/${state1}/detailed`)}>Detailed Report</TableCell>
                                </TableRow> 
                        </TableBody>
                    </Table> 
                : <div style={{margin:'10px',fontSize:'20px'}}>Loading or No Data Found</div>}
            </TableContainer>
        </Paper>
    )
}

export default FrequencyAdmin
