import React,{ useEffect, useContext } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { IdContext } from '../App'
import EnhancedTable from '../components/Table'

function Report() {
    const {id} = useParams()
    const history = useHistory();
    const {dispatch1} = useContext(IdContext)
    useEffect(() => {
        if(id){
            dispatch1({type:"ID",payload:id})
        }
    }, [id])
    // console.log(id)
    return (
        <div style={{padding:'20px'}}>
            <button 
                onClick={()=>history.push(`/manageAds`)} 
                className='btn #424242 grey darken-3'
                style={{margin:'20px',float:'left'}}
            >Back</button><br />
            <div style={{margin:'0 auto',fontSize:'larger',width:'fit-content',fontWeight:'500',borderBottom:'1px solid black'}}>Summary Report</div>
            <EnhancedTable />
        </div>
    )
}

export default Report
