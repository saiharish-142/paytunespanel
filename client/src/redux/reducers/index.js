import { combineReducers } from 'redux';
import authReducer from './authReducer';
import manageadsReducer from './manageadsReducer';
import clientmanageadsReducer from './clientmanageAdsReducer';
import manageBundlesReducer from './manageBundlesReducer';
import ratioReducer from './currencyReducer';
import reportReducer from './reportReducer';
import consoleDatedReducer from './ConsoledateReducer';
import quartileReducer from './ConsoleQuartileReducer';
import freqReducer from './FrequencyReducer';

export default combineReducers({
	auth: authReducer,
	ratio: ratioReducer,
	manageads: manageadsReducer,
	clientmanageads: clientmanageadsReducer,
	managebundles: manageBundlesReducer,
	report: reportReducer,
	quartile: quartileReducer,
	freq: freqReducer,
	consoleDateReport: consoleDatedReducer
});
