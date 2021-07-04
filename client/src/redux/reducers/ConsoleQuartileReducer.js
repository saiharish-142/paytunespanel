import { QUARTILE_ERROR, QUARTILE_LOADING, QUARTILE_LOADED } from '../types.js';

const initialState = {
	publisherDataLoading: true,
	publisherDataFail: null,
	quartileaudiopublisherData: [],
	quartilevideopublisherData: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case QUARTILE_LOADING:
			return {
				...state,
				publisherDataFail: false,
				publisherDataLoading: true
			};
		case QUARTILE_LOADED:
			console.log(action.payload);
			return {
				...state,
				publisherDataLoading: false,
				quartileaudiopublisherData: action.payload.caudio,
				quartilevideopublisherData: action.payload.cvideo
			};
		case QUARTILE_ERROR:
			return {
				...state,
				publisherDataLoading: false,
				publisherDataFail: true
			};
		default:
			return state;
	}
}
