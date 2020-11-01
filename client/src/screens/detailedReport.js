import React, { useContext, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory, useParams } from 'react-router-dom';
import { IdContext } from '../App';
import { Typography } from '@material-ui/core';

const rows =[
    {
        date: '23-oct-2020', type:'Audio', 
        impressions:'1000', spend:'300 USD',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '22-oct-2020', type:'Audio', 
        impressions:'1000', spend:'300 USD',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '21-oct-2020', type:'Audio', 
        impressions:'1000', spend:'300 USD',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '20-oct-2020', type:'Audio', 
        impressions:'1000', spend:'300 USD',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    }
]

const publisherwise = [
    {
        date: '23-oct-2020', type:'Audio', publisher:'Gaana', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'100', spend:'30 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '23-oct-2020', type:'Audio', publisher:'Jio Saavan', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'200', spend:'60 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '23-oct-2020', type:'Audio', publisher:'Spotify', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'150', spend:'45 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    },
    {
        date: '23-oct-2020', type:'Audio', publisher:'Wynk', dealId:'PYT-18878-0000b',dealName:'Gaana', 
        impressions:'100', spend:'30 USD', start:'15-oct-2020', end:'30-oct-2020',
        totalimpr:'3000', totalSpend:'900 USD', avgspent:'0.3 USD', totalday:'15 days', totalimpertobe:'1000',
        totalspenttobe:'300 USD', balimp:'2000', baldays:'7 days', balspe:'600 USD', avg:2000/7
    }
]

export default function DetailedTable() {
    const history = useHistory();
    const {state1,dispatch1} = useContext(IdContext)
    // const normal =(val)=>{
    //     let v = Math.round(val*100)/100
    //     // console.log(v)
    //     return v
    // }
    const { id } = useParams()
    useEffect(() => {
        if(id){
            dispatch1({type:"ID",payload:id})
        }
    }, [id])
    // console.log(id)
    return (
        <>
        <div style={{margin:'10px auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Detailed Report</div>
        <button 
            onClick={()=>history.push(`/manageAds/report/${state1}`)} 
            className='btn #424242 grey darken-3'
            style={{margin:'-20px 20px',float:'left'}}
        >Back</button><br />
        <TableContainer style={{margin:'10px auto',width:'fit-content'}} component={Paper}>
        <Typography variant="h6" id="tableTitle" component="div">
            Summary
        </Typography>
        <Table style={{margin:'20px',width:'fit-content',border:'1px lightgray solid'}} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Media Type</TableCell>
                {/* <TableCell>Publisher</TableCell> */}
                {/* <TableCell>Deal Id</TableCell> */}
                {/* <TableCell>Deal Name</TableCell> */}
                <TableCell>impressions</TableCell>
                <TableCell>Spend</TableCell>
                <TableCell>Avg spend per<br /> impression</TableCell>
                {/* <TableCell>Campaign Start Date</TableCell>
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
                <TableCell>Avg required</TableCell> */}
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row,i) => (
                <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {row.date}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    {/* <TableCell>{row.publisher}</TableCell> */}
                    {/* <TableCell>{row.dealId}</TableCell> */}
                    {/* <TableCell>{row.dealName}</TableCell> */}
                    <TableCell>{row.impressions}</TableCell>
                    <TableCell>{row.spend}</TableCell>
                    <TableCell>{row.avgspent}</TableCell>
                    {/* <TableCell>{row.start}</TableCell>
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
                    <TableCell>{normal(row.avg)}</TableCell> */}
                    {/* <TableCell className='mangeads__report'>Detailed Report</TableCell> */}
                </TableRow>
            ))} 
            </TableBody>
        </Table>
        </TableContainer>
        <TableContainer style={{margin:'60px auto',width:'fit-content'}} component={Paper}>
        <Typography variant="h6" id="tableTitle" component="div">
            Publishers wise Report
        </Typography>
        <Table style={{margin:'20px',width:'fit-content',border:'1px lightgray solid'}} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Media Type</TableCell>
                <TableCell>Deal Id</TableCell>
                {/* <TableCell>Deal Name</TableCell> */}
                <TableCell>impressions</TableCell>
                <TableCell>Spend</TableCell>
                <TableCell>Avg spend per<br /> impression</TableCell>
                {/* <TableCell>Campaign Start Date</TableCell>
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
                <TableCell>Avg required</TableCell> */}
            </TableRow>
            </TableHead>
            <TableBody>
            {publisherwise.map((row,i) => (
                <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {row.date}
                    </TableCell>
                    <TableCell>{row.publisher}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.dealId}</TableCell>
                    {/* <TableCell>{row.dealName}</TableCell> */}
                    <TableCell>{row.impressions}</TableCell>
                    <TableCell>{row.spend}</TableCell>
                    <TableCell>{row.avgspent}</TableCell>
                    {/* <TableCell>{row.start}</TableCell>
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
                    <TableCell>{normal(row.avg)}</TableCell> */}
                    {/* <TableCell className='mangeads__report'>Detailed Report</TableCell> */}
                </TableRow>
            ))} 
            </TableBody>
        </Table>
        </TableContainer>
        </>
    );
}