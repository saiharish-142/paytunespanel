import React,{ useContext, useState } from 'react'
// import logout from '../imgs/logout.svg'
// import dashboard from '../imgs/dashboard.svg'
import { useHistory } from 'react-router-dom'
import {UserContext} from '../App'
import TemporaryDrawer from './Drawer'

function Navbar() {
    const history = useHistory()
    const [show, setshow] = useState(false)
    const {state,dispatch} = useContext(UserContext)
    return (
        <>
        <div className='navbar'>
            <div className='navbar__logo' onClick={()=>history.push('/')} >PayTunes Music Ads</div>
            {state ? <div className='navbar__dasboard' >
                    <div style={{fontSize:'30px',paddingLeft:'20px',cursor:'pointer',color:"white"}}><TemporaryDrawer /></div>
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
                    <button className='btn #ef5350 red lighten-1' onClick={()=>history.push('/login')}>login</button>
                }
            </div>
        </div>
        </>
    )
}

export default Navbar
