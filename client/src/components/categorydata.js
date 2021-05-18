import React ,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';

import  {useForm} from 'react-hook-form'
import {Alert} from '@material-ui/lab'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Paper,Modal} from '@material-ui/core'

import Categorydataform from '../screens/categoryformdata'

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

  


export default function Categorydata(){
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
    settempdata(data)
}
//const [make_model,setmakemodel]=useState("")

const data=()=>{
  fetch('/subrepo/categorydata',{
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
    fetch('/subrepo/categorydata',{
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
   
const editPhonedata=()=>{
    //console.log(model,impression)
}


return(
    <div>
            <h4 style={{margin:"3%",fontWeight:'bolder'}}>Category data </h4> 
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
                        {  <TableCell>Category</TableCell>}
                        {  <TableCell>Impressions</TableCell>}
                        {  <TableCell>Name</TableCell>}
                        <TableCell>Tier1</TableCell>
                        <TableCell>Tier2</TableCell>
                        <TableCell>Tier3</TableCell>
                        {  <TableCell>Tier4</TableCell>}
                        {  <TableCell>Gender Category</TableCell>}
                        {<TableCell>Age category</TableCell>}
                        {<TableCell>New Taxonamy</TableCell>}
                        {<TableCell></TableCell>}
                        
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.category?row.category:""}
              </TableCell>
              <TableCell >{row.impressions?row.impressions:""}</TableCell>
              <TableCell >{row.name?row.name:""}</TableCell>
              <TableCell >{row.tier1?row.tier1:""}</TableCell>
              <TableCell >{row.tier2?row.tier2:""}</TableCell>
              <TableCell >{row.tier3?row.tier3:""}</TableCell>
              <TableCell >{row.tier4?row.tier4:""}</TableCell>
              <TableCell >{row.gender_category?row.gender_category:""}</TableCell>
              <TableCell >{row.age_category?row.age_category:""}</TableCell>
              <TableCell >{row.taxonamy?row.taxonamy:""}</TableCell>
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
                
            <h4>Edit Category Data</h4>
        <Categorydataform props={tempdata} setShow={setShow} setsuccess={setsuccess} data1={data} seterror={seterror}/>
                
            
            </div>
               :<></> }
    

            </Paper>
</div>
)
        }
