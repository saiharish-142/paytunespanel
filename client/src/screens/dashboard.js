import React,{ useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'

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
            {streamingads.length ? <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Advertiser</th>
                        <th>Pricing</th>
                        <th>RO from Advertiser</th>
                        <th>Pricing Model</th>
                        <th>Category</th>
                        <th>Created On</th>
                        <th>Report</th>
                    </tr>
                </thead>
                <tbody>
                    {streamingads.map((ad,i)=>{
                        return <tr key={i}>
                            <td>{ad.AdTitle}</td>
                            <td>{ad.Advertiser}</td>
                            <td>{ad.Pricing !== '0' && ad.Pricing}</td>
                            <td></td>
                            <td>{ad.PricingModel}</td>
                            <td>{ad.Category}</td>
                            <td>{ad.createdOn ? ad.createdOn.substring(0,10) : ad.createdAt.substring(0,10)}</td>
                            <td className='mangeads__report' onClick={()=>history.push(`/manageAds/report/${ad._id}`)}>Report</td>
                        </tr>
                    })}
                </tbody>
            </table> : <div> Loading... </div>}
        </div>
    )
}

export default Dashboard
