import React,{ useState } from 'react'
// import M from 'materialize-css'
import { Paper } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { loadinguser, loginUser } from '../redux/actions/authAction'

function Login() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const dispatchRedux = useDispatch();
    const login = () =>{
        const dataa = {email:email,password:password}
        dispatchRedux(loadinguser())
        dispatchRedux(loginUser(dataa))
    }
    return (
        <div className='login'>
            <Paper elevation={3}>
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
