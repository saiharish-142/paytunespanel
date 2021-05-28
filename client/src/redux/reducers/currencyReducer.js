import { RATIO_UPDATED, RATIO_ERROR, RATIO_CLEAR, RATIO_LOADING } from '../types.js';

const initialState = {
	ratio: null,
	error: null,
	isLoading: true
};

export default function(state = initialState, action) {
	switch (action.type) {
		case RATIO_LOADING:
			return {
				...state,
				isLoading: true
			};
		case RATIO_UPDATED:
			return {
				...state,
				isLoading: false,
				ratio: action.payload
			};
		case RATIO_CLEAR:
			return {
				...state,
				isLoading: false,
				ratio: null
			};
		case RATIO_ERROR:
			return {
				...state,
				isLoading: false,
				error: action.payload
			};
		default:
			return state;
	}
}
