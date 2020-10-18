import React,{ useEffect, createContext, useReducer, useContext  } from 'react';
import './App.css'; 
import { BrowserRouter, Redirect, Route, useHistory } from 'react-router-dom'
import Navbar from './components/Navbar';
import { reducer, InitialState} from './reducer.js/reducer'
import Login from './screens/Login';
import Dashboard from './screens/dashboard';
import Home from './screens/Home';
import Dashmenu from './components/dashmenu';

export const UserContext = createContext()

function App() {
  const history = useHistory()
  const [state, dispatch] = useReducer(reducer, InitialState)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
  }, [])
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          {state && <Dashmenu />}
          <Route
            path='/login' 
            render={()=>(state ? (state.usertype === 'admin' ? <Redirect to='/dashbord' /> : <Redirect to='/' />) : <Login />)}
          />
          <Route
            path='/'
            exact
            render={()=>(state ? <Home />: <Redirect to='/login' />)}
          />
          <Route
            path='/dashbord'
            render={()=>(state ? (state.usertype === 'admin' ? <Dashboard /> : <Redirect to='/' />) : <Redirect to='/login' />)}
          />
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
