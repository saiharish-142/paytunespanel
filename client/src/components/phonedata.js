import React ,{useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/Textfield';
import {Alert} from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));


export default function Phonedata(){
const classes=useStyles()

const [make_model,setmakemodel]=useState("")
const [cost,setcost]=useState("")
const [type,settype]=useState("")
const [release,setrelease]=useState("")
const [cumulative,setcumulative]=useState("")
const [company,setcompany]=useState("")
const [error,seterror]=useState("")
const [success,setsuccess]=useState("")
//const [make_model,setmakemodel]=useState("")

function Adddata(){
    fetch('http://127.0.0.1:5000/subrepo/addphonedata',{
            method:'post',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                make_model,
                cost,
                type,
                release,
                cumulative,
                company
            })
        }).then(data=>data.json()).then(
            dat=>{
                if(dat.error){
                    seterror(dat.error)
                    return console.log(dat.error)
                }
                setsuccess(dat)
                console.log(dat)
            }
        )
}

return(
    <form style={{marginTop:'3%',width:'90%'}} onSubmit={(e)=>
    {e.preventDefault()
    Adddata()}
    }>
    <h3>Add Phone Make and Model Pricing data</h3>
    {success||error?<div className={classes.root}><Alert severity={success?"success":"error"}>{success?success:error}</Alert></div>:""}
    <TextField placeholder='Make_Model' margin="dense" required={true} style={{width:'30%'}} onChange={(e)=>setmakemodel(e.target.value)} /><br/>
    <TextField placeholder='Cost' margin="dense" required={true} style={{width:'30%'}} onChange={(e)=>setcost(e.target.value)} /><br/>
    <TextField placeholder='Type' margin="dense" required={true} style={{width:'30%'}} onChange={(e)=>settype(e.target.value)}  /><br/>
    <TextField placeholder='Release Date' margin="dense" required={true} style={{width:'30%'}} onChange={(e)=>setrelease(e.target.value)} /><br/>
    <TextField placeholder='Cumulative' margin="dense" required={true} style={{width:'30%'}} onChange={(e)=>setcumulative(e.target.value)}  /><br/>
    <TextField placeholder='Company' margin="dense" required={true} style={{width:'30%'}} onChange={(e)=>setcompany(e.target.value)}  /><br/>
    <button className="btn" style={{margin:"2%"}}> Add Data </button>
    </form>
)

}