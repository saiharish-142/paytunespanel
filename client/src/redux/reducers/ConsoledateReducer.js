import { PUBLISHERDATA_ERROR, PUBLISHERDATA_LOADING, PUBLISHERDATA_LOADED, PUBLISHERDATA_CLEAR } from '../types.js';

const initialState = {
	publisherData: null,
	publisherDataLoading: true,
	publisherDataFail: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case PUBLISHERDATA_LOADING:
			return {
				...state,
				publisherDataFail: false,
				publisherDataLoading: true
			};
		case PUBLISHERDATA_LOADED:
			return {
				...state,
				publisherDataLoading: false,
				publisherData: action.payload
			};
		case PUBLISHERDATA_ERROR:
			return {
				...state,
				publisherDataLoading: false,
				publisherDataFail: true
			};
		case PUBLISHERDATA_CLEAR:
			return {
				publisherData: null,
				publisherDataLoading: true
			};
		default:
			return state;
	}
}
