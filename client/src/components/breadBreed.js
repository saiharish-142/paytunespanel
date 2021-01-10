import { Paper } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

function IconBreadcrumbs() {
  const history = useHistory();
  const {clientName} = useParams()
  const [url, seturl] = useState(window.location.href)
  const [linkParts, setlinkParts] = useState([])
  useEffect(() => {
    var parts = url.split('/')
    parts = parts.slice(3,)
    setlinkParts(parts)
    console.log(parts)
  }, [url])
  return (
    <Paper className='breed_paper'>
      {linkParts.map(hypmark => {
          return <div style={{display:'flex'}}>
            <div>{hypmark === 'manageAds' ? <div style={{cursor:'pointer'}} onClick={()=>{
              if(clientName){
                history.push(`/manageusers/${clientName}`)
              }else{
                history.push('/manageAds')
              }
            }}>Manage Ads /</div> : ''}</div>
            <div>{hypmark === 'detailed' ? <div>Detailed report /</div> : ''}</div>
            <div>{hypmark !== 'manageAds' && hypmark !== 'detailed' ? <div style={{cursor:'pointer'}} onClick={()=>{
              if(clientName){
                history.push(`/manageusers/${clientName}/${hypmark}`)
              }else{
                history.push(`/manageAds/${hypmark}`)
              }
            }}>{hypmark.toUpperCase()} /</div> : ''}</div>
          </div>
      })}
    </Paper>
  )
}

export default IconBreadcrumbs
