import React,{ useEffect, useContext } from 'react'
import { useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { IdContext } from '../App'
import BasicTableBundle from '../components/TableBundle'

function ReportBundle() {
    const {campname} = useParams()
    const history = useHistory();
    const {dispatch1} = useContext(IdContext)
    const [singlead, setsinglead] = useState({})
    const [title, settitle] = useState('')
    useEffect(() => {
        if(campname){
            dispatch1({type:"ID",payload:campname})
        }
    }, [campname])
    useEffect(()=>{
        if(campname){
            fetch(`/bundles/grp/${campname}`,{
                method:'get',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                settitle(result.bundleadtitle)
                setsinglead(result)
                console.log(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[campname])
    // const submitTitle = (adtitle) =>{
    //     if(adtitle){
    //         fetch(`/streamingads/updatename/${campname}`,{
    //             method:'put',
    //             headers:{
    //                 "Content-Type":"application/json",
    //                 "Authorization" :"Bearer "+localStorage.getItem("jwt")
    //             },body:JSON.stringify({
    //                 adtitle
    //             })
    //         }).then(res=>res.json())
    //         .then(result=>{
    //             setloading(false)
    //             setsinglead(result)
    //             // console.log(result)
    //         })
    //         .catch(err =>{
    //             setloading(false)
    //             console.log(err)
    //         })
    //     }else{
    //         M.toast({html:"Ad Title Shouldn't be empty", classes:'#ff5252 red accent-2'})
    //     }
    // }
    // console.log(id)
    return (
        <div style={{padding:'20px'}}>
            <div style={{width:'10vw'}}><button 
                onClick={()=>history.push(`/manageBundles`)} 
                className='btn #424242 grey darken-3'
                style={{margin:'20px',textAlign:'left'}}
            >Back</button></div>
            {/* <TitlRname title={title} settitle={settitle} submit={submitTitle} setloading={setloading} loading={loading} /> */}
            {/* <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div> */}
            <BasicTableBundle title={title} singlead={singlead} />
        </div>
    )
}

export default ReportBundle
