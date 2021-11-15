import {
	CLIENT_MANAGEADS_LOADING,
	CLIENT_MANAGEADS_LOADDED,
	CLIENT_MANAGEADS_LOAD_ERROR,
	CLIENT_MANAGEADS_SEARCH,
	CLIENT_MANAGEADS_PAGINATION,
	CLIENT_MANAGEADS_SORT_NAME
} from '../types.js';

const initialState = {
	manageads: null,
	searchedmanageads: null,
	ordername: 'remainingDays',
	orderdir: 'asc',
	message: null,
	error: null,
	isLoading: true,
	loadfail: null,
	pagination: 0,
	rowspp: 5,
	value: ''
};

export default function(state = initialState, action) {
	switch (action.type) {
		case CLIENT_MANAGEADS_LOADING:
			return {
				...state,
				loadfail: false,
				isLoading: true
			};
		case CLIENT_MANAGEADS_LOADDED:
			return {
				...state,
				isLoading: false,
				manageads: action.payload,
				searchedmanageads: action.payload
			};
		case CLIENT_MANAGEADS_LOAD_ERROR:
			return {
				...state,
				isLoading: false,
				loadfail: true
			};
		case CLIENT_MANAGEADS_SORT_NAME:
			return {
				...state,
				ordername: action.payload.name,
				orderdir: action.payload.direction,
				manageads: action.payload.adss,
				searchedmanageads: action.payload.searchadss
			};
		case CLIENT_MANAGEADS_SEARCH:
			return {
				...state,
				searchedmanageads: action.payload.ads,
				value: action.payload.value
			};
		case CLIENT_MANAGEADS_PAGINATION:
			return {
				...state,
				pagination: action.payload.pagination,
				rowspp: action.payload.rowspp
			};
		default:
			return state;
	}
}
