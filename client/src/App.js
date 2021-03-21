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
import ClientManage from './screens/ClientManage';
import ClientReport from './screens/ClientReport';
import ManageUser from './screens/ManageUser';
import CampaignBundle from './screens/CampaignBundle';
import DashboardBundle from './screens/manageBundles';
import ReportBundle from './screens/Reportbundle';
import DetailedTableBundle from './screens/detailedReportBundle';
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
              render={()=>(state ? (state.usertype === 'admin' ? <Dashboard /> : <ClientManage />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/manageBundles'
              exact
              render={()=>(state ? (state.usertype === 'admin' ? <DashboardBundle /> : <ClientManage />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/bundleManage/createbundle'
              exact
              render={()=>(state ? (state.usertype === 'admin' ? <CampaignBundle /> : <Redirect to='/manageAds' />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/bundleManage/:bundlename/edit'
              exact
              render={()=>(state ? (state.usertype === 'admin' ? <CampaignBundle /> : <Redirect to='/manageAds' />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/clientSideCamp'
              exact
              render={()=>(state ? (state.usertype === 'admin' && <DashboardBundle clientview={true} />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/manageusers'
              exact
              render={()=>(state && (state.usertype === 'admin' ? <ManageUser /> : <Home />))}
              />
            <Route
              path='/manageAds/:campname'
              exact
              render={()=>(state ? (state.usertype === 'admin' ? <Report /> : <ClientReport />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/manageBundles/:campname'
              exact
              render={()=>(state ? (state.usertype === 'admin' ? <ReportBundle /> : <ClientReport />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/clientSideCamp/:campname'
              exact
              render={()=>(state ? (state.usertype === 'admin' && <ClientReport />) : <Redirect to='/login' />)}
              /> 
            <Route
              path='/manageAds/:campname/detailed'
              render={()=>(state ? (state.usertype === 'admin' ? <DetailedTable /> : <Redirect to={`/manageAds`}/>) : <Redirect to='/login' />)}
              />
            <Route
              path='/manageBundles/:campname/detailed'
              exact
              render={()=>(state ? (state.usertype === 'admin' ? <DetailedTableBundle /> : <ClientReport />) : <Redirect to='/login' />)}
              /> 
          </>}
        </BrowserRouter>
      </div>
    </IdContext.Provider>
    </UserContext.Provider>
  );
}
export default App;