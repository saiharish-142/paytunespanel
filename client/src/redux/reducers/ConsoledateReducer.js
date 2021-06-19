import {
	PUBLISHERDATA_ERROR,
	PUBLISHERDATA_LOADING,
	PUBLISHERDATA_LOADED,
	PUBLISHERDATA_CLEAR,
	PUBLISHERDATA_PAGINATION,
	PUBLISHERDATA_SEARCH,
	PUBLISHERDATA_SORT
} from '../types.js';

const initialState = {
	publisherData: null,
	searchedpublisherData: null,
	publisherDataLoading: true,
	publisherDataordername: 'impression',
	publisherDataorderdir: 'desc',
	publisherDataValue: '',
	publisherDataPagination: 0,
	publisherDataRPP: 5,
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
				publisherData: action.payload,
				searchedpublisherData: action.payload
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
				searchedpublisherData: null,
				publisherDataLoading: true
			};
		case PUBLISHERDATA_PAGINATION:
			return {
				...state,
				publisherDataPagination: action.payload.pagination,
				publisherDataRPP: action.payload.rowspp
			};
		case PUBLISHERDATA_SEARCH:
			return {
				...state,
				searchedpublisherData: action.payload.ads,
				publisherDataValue: action.payload.value
			};
		case PUBLISHERDATA_SORT:
			return {
				...state,
				publisherDataordername: action.payload.name,
				publisherDataorderdir: action.payload.direction
			};
		default:
			return state;
	}
}
