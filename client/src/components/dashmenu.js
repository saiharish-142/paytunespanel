import React from 'react'
import { useHistory } from 'react-router-dom'

function Dashmenu() {
    const history = useHistory()
    return (
        <div className='dashmenu'>
            <div className='dashmenu__item' onClick={()=>history.push('/dashbord')}>
                <i className='material-icons'>equalizer</i>
                <div>Dashboard</div>
            </div>
            <hr />
            <div className='dashmenu__item'>
                <i className='material-icons'>keyboard_arrow_right</i>
                <div>Manage Ad Campaigns</div>
            </div>
            <hr />
            <div className='dashmenu__item'>
                <i className='material-icons'>keyboard_arrow_right</i>
                <div>Manage Audio Creations</div>
            </div>
            <hr />
            <div className='dashmenu__item'>
                <i className='material-icons'>keyboard_arrow_right</i>
                <div>Manage Banner Creatives</div>
            </div>
            <hr />
        </div>
    )
}

export default Dashmenu
