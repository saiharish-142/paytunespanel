import React,{ useEffect, useContext } from 'react'
import { useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { IdContext } from '../App'
// import EnhancedTable from '../components/Table'

function ReportPro() {
    const {campname} = useParams()
    const history = useHistory();
    const {dispatch1} = useContext(IdContext)
    const [singlead, setsinglead] = useState({})
    useEffect(() => {
        if(campname){
            dispatch1({type:"ID",payload:campname})
        }
    }, [campname])
    return (
        <div>
            
        </div>
    )
}

export default ReportPro
