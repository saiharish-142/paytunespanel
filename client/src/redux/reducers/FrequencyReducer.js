import { FREQUENCY_ERROR, FREQUENCY_LOADING, FREQUENCY_LOADED } from '../types.js';

const initialState = {
	Loading: true,
	Fail: null,
	data: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case FREQUENCY_LOADING:
			return {
				...state,
				Fail: false,
				Loading: true
			};
		case FREQUENCY_LOADED:
			return {
				...state,
				Loading: false,
				data: action.payload
			};
		case FREQUENCY_ERROR:
			return {
				...state,
				Loading: false,
				Fail: true
			};
		default:
			return state;
	}
}
