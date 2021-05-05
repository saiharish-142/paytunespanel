import React ,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';

import  {useForm} from 'react-hook-form'
import {Alert} from '@material-ui/lab'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Paper,Modal} from '@material-ui/core'

//import Phonedataform from '../screens/phonedataform'

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
  fetch('http://127.0.0.1:5000/subrepo/categorywisereports',{
            method:'POST',
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
    fetch('http://127.0.0.1:5000/subrepo/categorywisereports',{
            method:'POST',
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
            <h4 style={{margin:"3%",fontWeight:'bolder'}}>Category Wise Data </h4> 
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
                        {  <TableCell>Campaign Name</TableCell>}
                        {  <TableCell>Category</TableCell>}
                        {  <TableCell>Impressions</TableCell>}
                        <TableCell>parent</TableCell>
                        <TableCell>Tier1</TableCell>
                        <TableCell>Tier2</TableCell>
                        {  <TableCell>Tier3</TableCell>}
                        {  <TableCell>Tier4</TableCell>}
                        {<TableCell> Age Category</TableCell>}
                        {<TableCell>Gender Category</TableCell>}
                        
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.campaign_details.AdTitle}
              </TableCell>
              <TableCell >{row._id.category}</TableCell>
              <TableCell >{row.impressions}</TableCell>
              <TableCell >{row.extra_details.parent}</TableCell>
              <TableCell >{row.extra_details.tier1}</TableCell>
              <TableCell >{row.extra_details.tier2}</TableCell>
              <TableCell >{row.extra_details.tier3}</TableCell>
              <TableCell >{row.extra_details.tier4}</TableCell>
              <TableCell >{row.extra_details.AgeCategory}</TableCell>
              <TableCell >{row.extra_details.genderCategory}</TableCell>
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
        {/* {show?
        
            <div >
                
            <h4>Edit Phone Data</h4>
        <Phonedataform props={tempdata} setShow={setShow} setsuccess={setsuccess} data1={data} seterror={seterror}/>
                
            
            </div>
               :<></> } */}
    

            </Paper>
</div>
)
        }