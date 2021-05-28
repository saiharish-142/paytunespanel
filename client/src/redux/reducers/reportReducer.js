import {
	REPORT_LOADING,
	REPORT_BASE_LOADED,
	REPORT_LOADED,
	REPORT_ERROR,
	REPORT_ID_,
	REPORT_SPENT_LOADED
} from '../types.js';

const initialState = {
	req_id: null,
	ids: null,
	combine_ids: null,
	title: null,
	endDate: null,
	startDate: null,
	report: null,
	spent: null,
	message: null,
	error: null,
	isLoading: true,
	loadfail: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case REPORT_LOADING:
			return {
				...state,
				loadfail: false,
				isLoading: true
			};
		case REPORT_ID_:
			return {
				...state,
				req_id: action.payload
			};
		case REPORT_SPENT_LOADED:
			return {
				...state,
				spent: action.payload
			};
		case REPORT_BASE_LOADED:
			return {
				...state,
				ids: action.payload.ids,
				combine_ids: action.payload.id,
				title: action.payload.title,
				startDate: action.payload.startDate,
				endDate: action.payload.endDate
			};
		case REPORT_LOADED:
			return {
				...state,
				isLoading: false,
				report: action.payload
			};
		case REPORT_ERROR:
			return {
				...state,
				isLoading: false,
				loadfail: true
			};
		default:
			return state;
	}
}
