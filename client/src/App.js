import React,{ useEffect, createContext, useReducer  } from 'react';
import './App.css'; 
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import { reducer, InitialState} from './reducer.js/reducer'
import { reducer1, InitialState1} from './reducer.js/idreducer'
import Login from './screens/Login';
import Dashboard from './screens/manageAds';
import Home from './screens/Home';
import Report from './screens/Report';
import DetailedTable from './screens/detailedReport';
// import Dashmenu from './components/dashmenu';

export const UserContext = createContext()
export const IdContext = createContext()


function App() {
  // const history = useHistory()
  // const history = useHistory()
  const [state, dispatch] = useReducer(reducer, InitialState)
  const [state1, dispatch1] = useReducer(reducer1, InitialState1)
  // const [showMenu, setshowMenu] = useState(true)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      return <Redirect to='/login' />
    }
  }, [])
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <IdContext.Provider value={{state1,dispatch1}}>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Route
            path='/login' 
            render={()=>(state ? (state.usertype === 'admin' && <Redirect to='/' />) : <Login />)}
            />
          <Route
            path='/'
            exact
            render={()=>(state ? <Home />: <Redirect to='/login' />)}
            />
          {state && <> 
            <Route
              path='/manageAds'
              exact
              render={()=>(state ? (state.usertype === 'admin' && <Dashboard />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/manageAds/:campname'
              exact
              render={()=>(state ? (state.usertype === 'admin' && <Report />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/manageAds/:campname/detailed'
              render={()=>(state ? (state.usertype === 'admin' && <DetailedTable />) : <Redirect to='/login' />)}
              /> 
          </>}
        </BrowserRouter>
      </div>
    </IdContext.Provider>
    </UserContext.Provider>
  );
}
export default App;
// var fu = []
// fetch('https://serverprioritypulse.herokuapp.com/user',{
//   method:"get",
//   headers:{
//       "Content-Type":"application/json",
//     }
//     // body:JSON.stringify({
//     //     query:value
//     // })
//   }).then(res => res.json())
// .then(results => {
//     console.log(results)
//     setusers(results)
// })
// const [users, setusers] = useState([])
// const [foundusers, setfoundusers] = useState([])



// const se = (val) => {
//   fu =[]
//   for(var i=0;i<users.length;i++){
//     if((users[i].phoneNumber+'').indexOf(val) > -1){
//       // console.log(val)
//       fu.push(users[i])
//     }
//   }
//   console.log(fu)
// }

// <input type='text' value={value} onChange={(e)=>{
//   setvalue(e.target.value)
//   se(e.target.value)
//   // console.log((users[0].phoneNumber+'').indexOf(e.target.value))
// }} />