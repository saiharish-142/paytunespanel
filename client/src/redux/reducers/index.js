import { combineReducers } from 'redux';
import authReducer from './authReducer';
import manageadsReducer from './manageadsReducer';
import manageBundlesReducer from './manageBundlesReducer';
import ratioReducer from './currencyReducer';
import reportReducer from './reportReducer';

export default combineReducers({
	auth: authReducer,
	ratio: ratioReducer,
	manageads: manageadsReducer,
	managebundles: manageBundlesReducer,
	report: reportReducer
});
