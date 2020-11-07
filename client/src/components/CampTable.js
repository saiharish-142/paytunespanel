import React, { useContext } from "react";
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

const columns = [
    { id: "AdTitle", label: "Name", minWidth: 170 },
    { id: "Advertiser", label: "Advertiser",align: "left", minWidth: 170 },
    {
        id: "Pricing",
        label: "Pricing",
        minWidth: 50,
        align: "center"
        // format: (value) => value.toLocaleString("en-US")
    },
    {
        id: "ro",
        label: "RO from Advertiser",
        minWidth: 50,
        align: "center"
        // format: (value) => value.toLocaleString("en-US")
    },
    {
        id: "PricingModel",
        label: "Pricing Model",
        minWidth: 50,
        align: "center"
        // format: (value) => value.toFixed(2)
    },
    { id: "Category", label: "Category",align: "center", minWidth: 50 },
    { id: "createdOn", label: "Created On",align: "center", minWidth: 120 },
    { id: "Report", label: "", align: "center", minWidth: 50 },
];

const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    container: {
        maxHeight: 440
    }
});

export default function StickyHeadTable({streamingads}) {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {dispatch1} = useContext(IdContext)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {streamingads.length >= 1 ? streamingads
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) =>{ 
                    if(typeof row !== 'undefined'){
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        <TableCell align='left'>{row.AdTitle && row.AdTitle}</TableCell>
                        <TableCell align='left'>{row.Advertiser && row.Advertiser}</TableCell>
                        <TableCell align='center'>{row.Pricing && row.Pricing}</TableCell>
                        <TableCell align='center'>{row.ro && row.ro}</TableCell>
                        <TableCell align='center'>{row.PricingModel && row.PricingModel}</TableCell>
                        <TableCell align='center'>{row.Category && row.Category}</TableCell>
                        <TableCell align='center'>{row.createdOn ? row.createdOn.substring(0,10) : row.createdAt.substring(0,10)}</TableCell>
                        <TableCell align='center' className='mangeads__report' onClick={()=>{
                            history.push(`/manageAds/report/${row._id}`)
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
            count={streamingads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </Paper>
    );
}
