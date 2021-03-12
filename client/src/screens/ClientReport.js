import React,{ useEffect, useContext } from 'react'
import { useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { IdContext } from '../App'
import EnhancedTable from '../components/ClientTable'
import M from 'materialize-css'

function ClientReport() {
    const {campname} = useParams()
    const history = useHistory();
    const {state1,dispatch1} = useContext(IdContext)
    const [singlead, setsinglead] = useState({})
    const [title, settitle] = useState('')
    const [loading, setloading] = useState(true)
    useEffect(() => {
        if(campname){
            dispatch1({type:"ID",payload:campname})
        }
    }, [campname])
    useEffect(()=>{
        if(campname){
            fetch(`/bundles/${campname}`,{
                method:'get',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                settitle(result.bundleadtitle)
                setloading(false)
                setsinglead(result)
                // console.log(result[0])
            })
            .catch(err =>{
                setloading(false)
                console.log(err)
            })
        }
    },[campname])
    return (
        <div style={{padding:'20px'}}>
            <div style={{width:'10vw'}}><button 
                onClick={()=>history.push(`/clientSideCamp`)} 
                className='btn #424242 grey darken-3'
                style={{margin:'20px',textAlign:'left'}}
            >Back</button></div>
            {/* <TitlRname title={title} settitle={settitle} submit={submitTitle} setloading={setloading} loading={loading} /> */}
            {/* <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div> */}
            <EnhancedTable title={title} singlead={singlead} />
        </div>
    )
}

export default ClientReport
