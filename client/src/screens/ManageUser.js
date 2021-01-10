import { Button, FormControl, InputLabel, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import React, { useState } from 'react'
import { useEffect } from 'react'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import M from 'materialize-css'
import { useHistory } from 'react-router-dom';

function ManageUser() {
    const history = useHistory()
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [usertype, setusertype] = useState('')
    const [username, setusername] = useState('')
    const [users, setusers] = useState([])
    useEffect(()=>{
        fetch('/auth/users',{
            method:'get',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(uss=>{
            // console.log(uss)
            setusers(uss)
        }).catch(err => console.log(err))
    },[])
    useEffect(() => {
        console.log('users updated')
    }, [users])
    function createUser(){
        fetch('/auth/createUser',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                username, password, email, usertype
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html:result.error, classes:'#ff5252 red accent-2'}) 
            }else{
                var data = users
                data.push({username:username,usertype:usertype,email:email})
                // console.log(data)
                M.toast({html:result.message, classes:'#69f0ae green accent-2'})
                setusers(data)
                history.push('/manageusers')
            }
        }).catch(err => console.log(err))
    }
    function deleteUSer(susername) {
        // console.log(susername)
        fetch('/auth/deleteUser',{
            method:'delete',
            headers:{
                "Content-Type":"application/json",
                "Authorization" :"Bearer "+localStorage.getItem("jwt")
            },body:JSON.stringify({
                username:susername
            })
        }).then(res=>res.json())
        .then(result=>{
                var data = users
                data = data.filter(x => x.username !== susername)
                M.toast({html:result.message, classes:'#69f0ae green accent-2'})
                setusers(data)
        }).catch(err => console.log(err))
    }
    return (
        <>
            <Paper style={{width:'40%',padding:'30px',margin:'30px auto',display:'flex'}}>
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    // console.log(usertype,username,password)
                    createUser()
                }}>
                    <h5>Create a User</h5>
                    <input placeholder='Username' required value={username} onChange={(e)=>setusername(e.target.value)} />
                    <FormControl variant="outlined" style={{minWidth:'100%'}}>
                        <InputLabel htmlFor="outlined-age-native-simple">User Type</InputLabel>
                        <Select required native value={usertype} onChange={(e)=>setusertype(e.target.value)} label='USe Type'>
                            <option arial-label='None' value='' />
                            <option value='admin'>Admin</option>
                            <option value='client'>Client</option>
                        </Select>
                    </FormControl>
                    <input placeholder='Email' required value={email} onChange={(e)=>setemail(e.target.value)} />
                    <input type='password' placeholder='Password' required value={password} onChange={(e)=>setpassword(e.target.value)} />
                    <Button type='submit' color="primary" variant="contained">Create User</Button>
                </form>
            </Paper>
            <Paper style={{width:'50%',margin:'0 auto',padding:'20px'}}>
                <b style={{fontSize:'20px'}}>Users List</b>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Username</TableCell>
                            <TableCell align='center'>Email</TableCell>
                            <TableCell align='center'>User Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users && users.map((data,i)=>{
                            return <TableRow key={i}>
                                <TableCell align='center'>{data.username}{data.usertype!=='admin' && <p style={{cursor:'pointer'}} onClick={()=>history.push(`/manageusers/${data.username}`)}>Show Client side</p>}</TableCell>
                                <TableCell align='center'>{data.email}</TableCell>
                                <TableCell align='center'>{data.usertype}</TableCell>
                                {data.usertype!=='admin' && <TableCell align='center' onClick={()=>deleteUSer(data.username)} style={{cursor:'pointer'}}><DeleteOutlinedIcon /></TableCell>}
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

export default ManageUser
