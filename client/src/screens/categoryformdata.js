import React ,{useState} from 'react'
import TextField from '@material-ui/core/Textfield';
import { set } from 'react-hook-form';

export default  function Categorydataform({props,setShow,setsuccess,data1,seterror}){
console.log(props)

const [_id,set_id]=useState(props._id)    
const [category,setcategory]=useState(props.category) 
const [impression,setimpression]=useState(props.impressions) 
const [name,setname]=useState(props.name) 
const [tier1,settier1]=useState(props.tier1) 
const [tier2,settier2]=useState(props.tier2) 
const [tier3,settier3]=useState(props.tier3) 
const [tier4,settier4]=useState(props.tier4) 
const [gendercategory,setgender]=useState(props.gender_category) 
const [agecategory,setage]=useState(props.age_category)
const [taxonamy,settaxonamy]=useState(props.taxonamy)
//load()
function editCategorydata(){
    fetch('http://127.0.0.1:5000/subrepo/editcategorydata',{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "Authorization" :"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            _id,
            category,
            name,
            tier1,
            tier2,
            tier3,
            tier4,
            gendercategory,
            agecategory,
            taxonamy
        })
    }).then(res=>res.json()).then(data=>{
        if(data.error){
            seterror(data.error)
            return console.log(data.error)
        }
        console.log(data)
        setShow(false)
        setsuccess(data)
        data1()
        
    })
}

// function load(){
//     setMake_model(props.make_model)
//     setrelease(props.release)
//     setcompany(props.company)
//     setcost(props.cost)
//     setcumulative(props.cumulative)
//     setmodel(props.model)
//     settotal_percent(props.total_percent)
//     settype(props.type)
// }

return (
        <div>
        <form style={{margin:"2%"}} >
            <TextField placeholder='Category' margin="dense" label="Category" required={true} value={category}  style={{width:'30%'}} onChange={(e)=>{setcategory(e.target.value)}} /><br/>
            <TextField placeholder='Impressions' margin="dense" label="Impressions (No Change)" required={true} style={{width:'30%'}} value={impression?impression:""} onChange={(e)=>{setimpression(e.target.value)}} /><br/>
            <TextField placeholder='Name' margin="dense" label="Name" style={{width:'30%'}} value={name} required={true} onChange={(e)=>{setname(e.target.value)}} /><br/>
            <TextField placeholder='Tier1' margin="dense" required={true} label="Tier1" style={{width:'30%'}} value={tier1} onChange={(e)=>{settier1(e.target.value)}} /><br/>
            <TextField placeholder='Tier2' margin="dense" required={true} label="Tier2" style={{width:'30%'}} value={tier2} onChange={(e)=>{settier2(e.target.value)}} /><br/>
            <TextField placeholder='Tier3' margin="dense" required={true} label="Tier3" style={{width:'30%'}} value={tier3} onChange={(e)=>{settier3(e.target.value)}} /><br/>
            <TextField placeholder='Tier4' margin="dense" label="Tier4" style={{width:'30%'}} value={tier4} required={true} onChange={(e)=>{settier4(e.target.value)}} /><br/>
            <TextField placeholder='Gender_Category' margin="dense" label="Gender_Category" style={{width:'30%'}} value={gendercategory} required={true} onChange={(e)=>{setgender(e.target.value)}} /><br/>
            <TextField placeholder='Age_Category' margin="dense" label="Age_Category" style={{width:'30%'}} value={agecategory} required={true} onChange={(e)=>{setage(e.target.value)}} /><br/>
            <TextField placeholder='New_Taxonamy' margin="dense" label="New_Taxonamy" style={{width:'30%'}} value={taxonamy} required={true} onChange={(e)=>{settaxonamy(e.target.value)}} /><br/>
        </form>
        <button className="btn" style={{marginBottom:"2%"}} onClick={editCategorydata}>Edit Info</button>
        </div>
        
    )
}