import React,{ useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/CampTable'
import SearchCampagin from '../components/SearchCampagin'

function DashboardBundle({clientview}) {
    const history = useHistory()
    const [loading, setloading] = useState(true)
    const [searchval, setSearchval] = useState('')
    const [streamingads, setStreamingads] = useState([])
    const [streamingadsSearched, setStreamingadsSearched] = useState([])
    useEffect(() => {
        fetch('/bundles/',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            console.log(result)
            var datareq = result;
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.endDate)
                var d2 = new Date(b.endDate)
                return d2 - d1;
            })
            setloading(false)
            setStreamingads(datareq)
            setStreamingadsSearched(datareq)
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
            // console.log(sec)
            sec.map(ads => {
                // console.log(ads.Adtitle)
                if((ads.Adtitle.toLowerCase()).indexOf(val.toLowerCase()) > -1){
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
            {!loading ? <DataTable clientview={clientview} streamingads={streamingadsSearched} settingcamp={setStreamingadsSearched} />: <div> loading... </div>}
            {/* {streamingads.length ? "": <div> Loading... </div>} */}
        </div>
    )
}

export default DashboardBundle