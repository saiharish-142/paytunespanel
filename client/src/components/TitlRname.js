import { Paper } from '@material-ui/core'
import React from 'react'

function TitlRname({title,settitle,submit,setloading,loading}) {
    return (
        <div style={{display:"flex",justifyContent:'center'}}>
            <Paper style={{width:'60%',margin:'0 0 20px 0'}}>
                {loading ? <div style={{margin:'20px'}}>loading....</div> : <form onSubmit={e=>{
                    e.preventDefault()
                    setloading(true)
                    submit(title)
                }}>
                    <input value={title} placeholder='Ad Title' onChange={e=>settitle(e.target.value)} style={{width:"70%",margin:'0 20px 10px 20px'}} />
                    <button className='btn' type="submit">rename</button></form>
                }
            </Paper>
        </div>
    )
}

export default TitlRname
