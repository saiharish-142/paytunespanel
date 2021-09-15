import {
	REPORT_LOADING,
	REPORT_BASE_LOADED,
	REPORT_LOADED,
	REPORT_LOADED_CLIENT,
	REPORT_BASE_LOADED_CLIENT,
	REPORT_ERROR,
	REPORT_ID_,
	REPORT_LOADING_SUMMDET,
	REPORT_LOADED_SUMMDET,
	REPORT_ERROR_SUMMDET,
	REPORT_SPENT_LOADED,
	REPORT_CLEAR
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
	issumdetLoading: true,
	sumdetreport: null,
	sumdeterr: false,
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
		case REPORT_LOADING_SUMMDET:
			return {
				...state,
				sumdeterr: false,
				issumdetLoading: true
			};
		case REPORT_ID_:
			return {
				...state,
				req_id: action.payload
			};
		case REPORT_ERROR_SUMMDET:
			return {
				...state,
				sumdeterr: true
			};
		case REPORT_LOADED_SUMMDET:
			return {
				...state,
				req_id: action.payload
			};
		case REPORT_SPENT_LOADED:
			return {
				...state,
				sumdetreport: action.payload.data,
				issumdetLoading: false
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
		case REPORT_BASE_LOADED_CLIENT:
			return {
				...state,
				data: action.payload.main,
				ids: action.payload.ids,
				title: action.payload.title,
				startDate: action.payload.startDate,
				endDate: action.payload.endDate
			};
		case REPORT_LOADED_CLIENT:
			return {
				...state,
				sets: action.payload.mains,
				grp_ids: action.payload.ids,
				isLoading: false,
				report: action.payload.report
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
		case REPORT_CLEAR:
			return {
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
		default:
			return state;
	}
}
