import React,{ useEffect, useContext } from 'react'
import { useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { IdContext } from '../App'
import EnhancedTable from '../components/Table'
import TitlRname from '../components/TitlRname'
import M from 'materialize-css'

function Report() {
    const {id} = useParams()
    const history = useHistory();
    const {dispatch1} = useContext(IdContext)
    const [singlead, setsinglead] = useState({})
    const [title, settitle] = useState('')
    const [loading, setloading] = useState(true)
    useEffect(() => {
        if(id){
            dispatch1({type:"ID",payload:id})
        }
    }, [id])
    useEffect(()=>{
        if(id){
            fetch(`/streamingads/allads/${id}`,{
                method:'get',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                settitle(result[0].AdTitle)
                setloading(false)
                setsinglead(result[0])
                console.log(result[0])
            })
            .catch(err =>{
                setloading(false)
                console.log(err)
            })
        }
    },[id])
    const submitTitle = (adtitle) =>{
        if(adtitle){
            fetch(`/streamingads/updatename/${id}`,{
                method:'put',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                },body:JSON.stringify({
                    adtitle
                })
            }).then(res=>res.json())
            .then(result=>{
                setloading(false)
                setsinglead(result)
                // console.log(result)
            })
            .catch(err =>{
                setloading(false)
                console.log(err)
            })
        }else{
            M.toast({html:"Ad Title Shouldn't be empty", classes:'#ff5252 red accent-2'})
        }
    }
    // console.log(id)
    return (
        <div style={{padding:'20px'}}>
            <button 
                onClick={()=>history.push(`/manageAds`)} 
                className='btn #424242 grey darken-3'
                style={{margin:'20px',float:'left'}}
            >Back</button><br />
            <TitlRname title={title} settitle={settitle} submit={submitTitle} setloading={setloading} loading={loading} />
            <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div>
            <EnhancedTable singlead={singlead} />
        </div>
    )
}

export default Report
