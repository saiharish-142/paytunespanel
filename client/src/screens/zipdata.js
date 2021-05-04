import React ,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
// import  {useForm} from 'react-hook-form'
import {Alert} from '@material-ui/lab'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Paper,Modal} from '@material-ui/core'

import Zipdataform from '../components/zipformdata'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
      table:{
        // minWidth: '55%',
        width:'98%',
    },
    
    },
  }));

  


export default function Zipdata(){
const classes=useStyles()


const [error,seterror]=useState("")
const [success,setsuccess]=useState("")
const [rows,setrows]=useState([])
const [rowsPerPage, setRowsPerPage] = useState(7)
const [page, setPage] = useState(0)
const handleChangePage = (event, newPage) => {
    setPage(newPage);
};
const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
};
const [show, setShow] = useState(false);
const [tempdata,settempdata]=useState({})




  const handleShow = (data) => {
      setShow(true)
    console.log(data)
    settempdata(data)
}
//const [make_model,setmakemodel]=useState("")

const data=()=>{
  fetch('/subrepo/zipdata',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },
        }).then(data=>data.json()).then(
            dat=>{
                if(dat.error){
                    //seterror(dat.error)
                    return console.log(dat.error)
                }

                // setsuccess(dat)
                setrows(dat)
                console.log(dat)
            }
        )
}

useEffect(()=>{
    fetch('/subrepo/zipdata',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },
        }).then(data=>data.json()).then(
            dat=>{
                if(dat.error){
                    //seterror(dat.error)
                    return console.log(dat.error)
                }

                // setsuccess(dat)
                setrows(dat)
                console.log(dat)
            }
        )
},[])


return(
    <div>
            <h4 style={{margin:"3%",fontWeight:'bolder'}}>Zip data </h4> 
            <div className={classes.root}>
            {success?<Alert onClose={() => {setsuccess("")}} style={{margin:"1%"}} severity="success">{success}</Alert>:<></>}
            {error?<Alert onClose={() => {seterror("")}} style={{margin:"1%"}} severity="error">{error}</Alert>:""}
            </div>
            
            <Paper>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>  
                        {/* <TableCell>{title}</TableCell> */}
                        {  <TableCell>Pincode</TableCell>}
                        {  <TableCell>Urban/Rural</TableCell>}
                        {  <TableCell>Lower Sub City</TableCell>}
                        <TableCell>Subcity</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Grand City</TableCell>
                        {  <TableCell>District</TableCell>}
                        {  <TableCell>Comparison</TableCell>}
                        {<TableCell> State</TableCell>}
                        {<TableCell>Grand State</TableCell>}
                        {<TableCell>Lat</TableCell>}
                        {<TableCell>Long</TableCell>}
                        {<TableCell></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows && rows.length && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.pincode?row.pincode:""}
              </TableCell>
              <TableCell >{row.area?row.area:""}</TableCell>
              <TableCell >{row.lowersubcity?row.lowersubcity:""}</TableCell>
              <TableCell >{row.subcity?row.subcity:""}</TableCell>
              <TableCell >{row.city?row.city:""}</TableCell>
              <TableCell >{row.grandcity?row.grandcity:""}</TableCell>
              <TableCell >{row.district?row.district:""}</TableCell>
              <TableCell >{row.comparison?row.comparison:""}</TableCell>
              <TableCell >{row.state?row.state:""}</TableCell>
              <TableCell >{row.grandstate?row.grandstate:""}</TableCell>
              <TableCell >{row.latitude?row.latitude:""}</TableCell>
              <TableCell >{row.longitude?row.longitude:""}</TableCell>
              <TableCell ><button className="btn" onClick={()=>handleShow(row) }>Edit </button></TableCell>
            </TableRow>
          ))}
                </TableBody>
                </Table>
            </TableContainer>
    <TablePagination
                rowsPerPageOptions={[10,100,1000,10000]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                //style={{float:'left'}}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        {show?
        
            <div >
                
            <h4>Edit Zip Data</h4>
        <Zipdataform props={tempdata} setShow={setShow} setsuccess={setsuccess} data1={data} seterror={seterror}/>
                
            
            </div>
               :<></> }
    

            </Paper>
</div>
)
        }