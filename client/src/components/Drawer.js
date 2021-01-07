import React from 'react';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {UserContext} from '../App'

const useStyles = makeStyles({
list: {
    width: 250,
},
fullList: {
    width: 'auto',
},
});

export default function TemporaryDrawer() {
    const history = useHistory()
    const classes = useStyles();
    const [open, setopen] = React.useState(false);
    const {state} = React.useContext(UserContext)
    return (
        <div>
            <div onClick={()=>setopen(true)}><i className='material-icons' style={{fontSize:'30px',cursor:'pointer',color:"white"}}>menu</i></div>
            <Drawer anchor='left' open={open} onClose={()=>setopen(false)}>
                <div className={classes.list} role="presentation" onClick={()=>setopen(false)} onKeyDown={()=>setopen(false)}>
                    <ListItem className='dashmenu__item'>
                        <ListItemIcon><i className='material-icons'>equalizer</i></ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                    </ListItem>
                    <hr />
                    <ListItem className='dashmenu__item' onClick={()=>history.push('/manageAds')}>
                        <ListItemIcon><i className='material-icons'>keyboard_arrow_right</i></ListItemIcon>
                        <ListItemText>Manage Ad Campaigns</ListItemText>
                    </ListItem>
                    <hr />
                    <ListItem className='dashmenu__item'>
                        <ListItemIcon><i className='material-icons'>keyboard_arrow_right</i></ListItemIcon>
                        <ListItemText>Manage Audio Creations</ListItemText>
                    </ListItem>
                    <hr />
                    <ListItem className='dashmenu__item'>
                        <ListItemIcon><i className='material-icons'>keyboard_arrow_right</i></ListItemIcon>
                        <ListItemText>Manage Banner Creatives</ListItemText>
                    </ListItem>
                    {state && state.usertype === 'admin' && <>
                        <hr />
                        <ListItem className='dashmenu__item' onClick={()=>history.push('/manageusers')}>
                            <ListItemIcon><i className='material-icons'>keyboard_arrow_right</i></ListItemIcon>
                            <ListItemText>Manage Users</ListItemText>
                        </ListItem>
                    </>}
                </div>
            </Drawer>
        </div>
    );
}
