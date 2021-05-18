import { combineReducers } from 'redux';
import authReducer from './authReducer';
import manageadsReducer from './manageadsReducer';

export default combineReducers({
	auth: authReducer,
	manads: manageadsReducer
});
