import { combineReducers } from 'redux';
import authReducer from './authReducer';
import manageadsReducer from './manageadsReducer';
import manageBundlesReducer from './manageBundlesReducer';
import ratioReducer from './currencyReducer';
import reportReducer from './reportReducer';
import consoleDatedReducer from './ConsoledateReducer';

export default combineReducers({
	auth: authReducer,
	ratio: ratioReducer,
	manageads: manageadsReducer,
	managebundles: manageBundlesReducer,
	report: reportReducer,
	consoleDateReport: consoleDatedReducer
});
