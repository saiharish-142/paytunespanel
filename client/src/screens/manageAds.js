import React,{ useContext, useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/CampTable'
import SearchCampagin from '../components/SearchCampagin'
import { UserContext } from '../App'

function Dashboard({clientview}) {
    const history = useHistory()
    const {state,dispatch} = useContext(UserContext)
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
            console.log(result)
            var datareq = result;
            datareq = datareq.sort(function(a,b){
                var d1 = new Date(a.endDate[0])
                var d2 = new Date(b.endDate[0])
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
            <SearchCampagin state={state && state.usertype} inval={searchval} setInval={onChange} />
            {!loading ? <DataTable clientview={clientview} streamingads={streamingadsSearched} settingcamp={setStreamingadsSearched} />: <div> loading... </div>}
            {/* {streamingads.length ? "": <div> Loading... </div>} */}
        </div>
    )
}

export default Dashboard