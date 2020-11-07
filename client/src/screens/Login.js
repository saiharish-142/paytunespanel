import React,{ useState, useContext } from 'react'
import M from 'materialize-css'
import {UserContext} from '../App'
import { useHistory } from 'react-router-dom'
import { Paper } from '@material-ui/core'

function Login() {
    const history = useHistory()
    const {dispatch} = useContext(UserContext)
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const login = () =>{
        fetch('/auth/signin',{
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error, classes:'#ff5252 red accent-2'}) 
            }else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Signedin Successfully", classes:'#69f0ae green accent-2'})
                history.push('/')
            }
        })
    }
    return (
        <div className='login'>
            <Paper>
                <form className='login__box' onSubmit={e=>{
                    e.preventDefault()
                    login()
                }}>
                    <div className='login__title'>Log In</div>
                    <input placeholder='Email' required value={email} onChange={(e)=>setemail(e.target.value)} />
                    <input type='password' placeholder='Password' required value={password} onChange={(e)=>setpassword(e.target.value)} />
                    <button className='btn'>login</button>
                </form>
            </Paper>
        </div>
    )
}

export default Login
