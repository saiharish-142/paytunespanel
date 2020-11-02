import React,{ useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/CampTable'

function Dashboard() {
    const history = useHistory()
    const [streamingads, setStreamingads] = useState([])
    useEffect(() => {
        fetch('/streamingads/allads',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            console.log(result)
            setStreamingads(result)
        }).catch(err=>console.log(err))
    }, [])
    return (
        <div className='dashboard'>
            <DataTable streamingads={streamingads} />
            {streamingads.length ? "": <div> Loading... </div>}
        </div>
    )
}

export default Dashboard