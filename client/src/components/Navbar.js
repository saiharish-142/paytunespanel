import React,{ useContext } from 'react'
// import logout from '../imgs/logout.svg'
// import dashboard from '../imgs/dashboard.svg'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'

function Navbar() {
    const history = useHistory()
    const {state,dispatch} = useContext(UserContext)
    return (
        <div className='navbar'>
            <div className='navbar__logo' onClick={()=>history.push('/')} >PayTunes Music Ads</div>
            {state && state.usertype==='admin'? <div className='navbar__dasboard'>
                    <i className='material-icons' 
                        style={{fontSize:'30px',paddingLeft:'20px',cursor:'pointer',color:"white"}}
                    >menu</i>
                </div> : ''}
            <div className='navbar__icons'>
                {state ? 
                    <button className='btn #ef5350 red lighten-1' onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/login')
                    }} style={{color:'black'}}>
                        <i className="material-icons" style={{color:'white'}}>exit_to_app</i>
                    </button>:
                    <button className='btn #ef5350 red lighten-1'>login</button>
                }
            </div>
        </div>
    )
}

export default Navbar
