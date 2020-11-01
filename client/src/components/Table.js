import React, { useContext } from 'react';
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

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const rows =[
    {
        date: '23-oct-2020', type:'Audio', publisher:'Gaana', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'100', spend:'30 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    }
]

const row2 =[
    {
        date: '23-oct-2020', type:'Audio', publisher:'Gaana', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'100', spend:'30 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '23-oct-2020', type:'Audio', publisher:'Jio Saavan', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'100', spend:'30 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    }
]

export default function BasicTable() {
    const history = useHistory();
    const {state1} = useContext(IdContext)
    const classes = useStyles();
    // console.log(state1)
    const normal =(val)=>{
        let v = Math.round(val*100)/100
        // console.log(v)
        return v
    }
    return (
        <>
        <TableContainer style={{margin:'20px 0'}} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                {/* <TableCell>Date</TableCell>
                <TableCell>Media Type</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Deal Id</TableCell>
                <TableCell>Deal Name</TableCell>
                <TableCell>impressions</TableCell>
                <TableCell>Spend</TableCell>
                <TableCell>Avg spend per impression</TableCell> */}
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total spend planned for the campaign</TableCell>
                <TableCell>Avg Spend per impression planned</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Total Spend Till date</TableCell>
                <TableCell>Avg Spend per impression Till Date</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell>Balance Spend</TableCell>
                <TableCell>Avg required</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row,i) => (
                <TableRow key={i}>
                    {/* <TableCell component="th" scope="row">
                        {row.date}
                    </TableCell> */}
                    {/* <TableCell>{row.type}</TableCell>
                    <TableCell>{row.publisher}</TableCell>
                    <TableCell>{row.dealId}</TableCell>
                    <TableCell>{row.dealName}</TableCell>
                    <TableCell>{row.impressions}</TableCell>
                    <TableCell>{row.spend}</TableCell>
                    <TableCell>{row.avgspent}</TableCell> */}
                    <TableCell>{row.start}</TableCell>
                    <TableCell>{row.end}</TableCell>
                    <TableCell>{row.totalimpr}</TableCell>
                    <TableCell>{row.totalSpend}</TableCell>
                    <TableCell>{row.avgspent}</TableCell>
                    <TableCell>{row.totalday}</TableCell>
                    <TableCell>{row.totalimpertobe}</TableCell>
                    <TableCell>{row.totalspenttobe}</TableCell>
                    <TableCell>{row.avgspent}</TableCell>
                    <TableCell>{row.balimp}</TableCell>
                    <TableCell>{row.baldays}</TableCell>
                    <TableCell>{row.balspe}</TableCell>
                    <TableCell>{normal(row.avg)}</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/report/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            ))} 
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'20px 0'}} component={Paper}>
        <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Publisher Wise Summary Report</div>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                {/* <TableCell>Date</TableCell>
                <TableCell>Media Type</TableCell>*/}
                <TableCell>Publisher</TableCell>
                {/*<TableCell>Deal Id</TableCell>
                <TableCell>Deal Name</TableCell>
                <TableCell>impressions</TableCell>
                <TableCell>Spend</TableCell>
                <TableCell>Avg spend per impression</TableCell> */}
                <TableCell>Campaign Start Date</TableCell>
                <TableCell>Campaign End Date</TableCell>
                <TableCell>Total Impressions to be delivered</TableCell>
                <TableCell>Total spend planned for the campaign</TableCell>
                <TableCell>Avg Spend per impression planned</TableCell>
                <TableCell>Total Days of Campaign</TableCell>
                <TableCell>Total Impressions Delivered till date</TableCell>
                <TableCell>Total Spend Till date</TableCell>
                <TableCell>Avg Spend per impression Till Date</TableCell>
                <TableCell>Balance Impressions</TableCell>
                <TableCell>Balance Days</TableCell>
                <TableCell>Balance Spend</TableCell>
                <TableCell>Avg required</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {row2.map((row,i) => (
                <TableRow key={i}>
                    {/* <TableCell component="th" scope="row">
                        {row.date}
                    </TableCell> */}
                    {/* <TableCell>{row.type}</TableCell>*/}
                    <TableCell>{row.publisher}</TableCell>
                    {/*<TableCell>{row.dealId}</TableCell>
                    <TableCell>{row.dealName}</TableCell>
                    <TableCell>{row.impressions}</TableCell>
                    <TableCell>{row.spend}</TableCell>
                    <TableCell>{row.avgspent}</TableCell> */}
                    <TableCell>{row.start}</TableCell>
                    <TableCell>{row.end}</TableCell>
                    <TableCell>{row.totalimpr}</TableCell>
                    <TableCell>{row.totalSpend}</TableCell>
                    <TableCell>{row.avgspent}</TableCell>
                    <TableCell>{row.totalday}</TableCell>
                    <TableCell>{row.totalimpertobe}</TableCell>
                    <TableCell>{row.totalspenttobe}</TableCell>
                    <TableCell>{row.avgspent}</TableCell>
                    <TableCell>{row.balimp}</TableCell>
                    <TableCell>{row.baldays}</TableCell>
                    <TableCell>{row.balspe}</TableCell>
                    <TableCell>{normal(row.avg)}</TableCell>
                    <TableCell className='mangeads__report' onClick={()=>history.push(`/manageAds/report/${state1}/detailed`)}>Detailed Report</TableCell>
                </TableRow>
            ))} 
            </TableBody>
        </Table>
        </TableContainer>
        </>
    );
}
