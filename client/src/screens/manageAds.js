import React,{ useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/CampTable'
import SearchCampagin from '../components/SearchCampagin'

function Dashboard() {
    const history = useHistory()
    const [loading, setloading] = useState(true)
    const [searchval, setSearchval] = useState('')
    const [streamingads, setStreamingads] = useState([])
    const [streamingadsSearched, setStreamingadsSearched] = useState([])
    useEffect(() => {
        fetch('/streamingads/grouped',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            // console.log(result)
            setloading(false)
            setStreamingads(result)
            setStreamingadsSearched(result)
        }).catch(err=>{
            setloading(false)
            console.log(err)
        })
    }, [])
    const onChange = (val) => {
        var sec =[];
        var match = [];
        setSearchval(val)
        // console.log(val.toLowerCase())
        if(val){
            sec = streamingads
            sec.map(ads => {
                if((ads.AdTitle.toLowerCase()).indexOf(val.toLowerCase()) > -1){
                    // console.log('not1')
                    match.push(ads)
                }
            })
            setStreamingadsSearched(match)
        }else{
            setStreamingadsSearched(streamingads)
        }
    }
    return (
        <div className='dashboard'>
            <SearchCampagin inval={searchval} setInval={onChange} />
            {!loading ? <DataTable streamingads={streamingadsSearched} />: <div> loading... </div>}
            {/* {streamingads.length ? "": <div> Loading... </div>} */}
        </div>
    )
}

export default Dashboard