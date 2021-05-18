import React,{ useEffect, useContext } from 'react'
import { useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { IdContext } from '../App'
import EnhancedTable from '../components/Table'
// import M from 'materialize-css'

function Report() {
    const {campname} = useParams()
    const history = useHistory();
    const {dispatch1} = useContext(IdContext)
    const [singlead, setsinglead] = useState({})
    // const [title, settitle] = useState('')
    // const [loading, setloading] = useState(true)
    useEffect(() => {
        if(campname){
            dispatch1({type:"ID",payload:campname})
        }
    }, [campname])
    console.log(campname)
    useEffect(()=>{
        if(campname){
            fetch(`/streamingads/groupedsingle`,{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    adtitle:campname
                })
            }).then(res=>res.json())
            .then(result=>{
                // settitle(result[0].AdTitle)
                // setloading(false)
                setsinglead(result)
                console.log(result)
            })
            .catch(err =>{
                // setloading(false)
                console.log(err)
            })
        }
    },[campname])
    // console.log(id)
    return (
        <div style={{padding:'20px'}}>
            <div style={{width:'10vw'}}><button 
                onClick={()=>history.push(`/manageAds`)} 
                className='btn #424242 grey darken-3'
                style={{margin:'20px',textAlign:'left'}}
            >Back</button></div>
            {/* <TitlRname title={title} settitle={settitle} submit={submitTitle} setloading={setloading} loading={loading} /> */}
            {/* <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div> */}
            <EnhancedTable singlead={singlead} />
        </div>
    )
}

export default Report
