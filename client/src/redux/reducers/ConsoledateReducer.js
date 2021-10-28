import {
	PUBLISHERDATA_ERROR,
	PUBLISHERDATA_LOADING,
	PUBLISHERDATA_LOADED,
	PUBLISHERDATA_CLEAR,
	UNIQUEUSERSPUBLISHER_LOADING,
	UNIQUEUSERSPUBLISHER_LOADED,
	UNIQUEUSERSPUBLISHER_ERROR,
	PUBLISHERDATA_PAGINATION_AUDIO,
	PUBLISHERDATA_PAGINATION_DISPLAY,
	PUBLISHERDATA_PAGINATION_VIDEO,
	PUBLISHERDATA_SEARCH_AUDIO,
	PUBLISHERDATA_SEARCH_DISPLAY,
	PUBLISHERDATA_SEARCH_VIDEO,
	PUBLISHERDATA_SORT_AUDIO,
	PUBLISHERDATA_SORT_DISPLAY,
	PUBLISHERDATA_SORT_VIDEO
} from '../types.js';

const initialState = {
	publisherDataLoading: true,
	publisherDataFail: null,
	CompletepublisherData: null,
	totalpublisherData: null,
	quartileaudiopublisherData: null,
	quartilevideopublisherData: null,
	audiopublisherData: null,
	audiosearchedpublisherData: null,
	audiopublisherDataordername: 'impression',
	audiopublisherDataorderdir: 'desc',
	audiopublisherDataValue: '',
	audiopublisherDataPagination: 0,
	audiopublisherDataRPP: 5,
	displaypublisherData: null,
	displaysearchedpublisherData: null,
	displaypublisherDataordername: 'impression',
	displaypublisherDataorderdir: 'desc',
	displaypublisherDataValue: '',
	displaypublisherDataPagination: 0,
	displaypublisherDataRPP: 5,
	videopublisherData: null,
	videosearchedpublisherData: null,
	videopublisherDataordername: 'impression',
	videopublisherDataorderdir: 'desc',
	videopublisherDataValue: '',
	videopublisherDataPagination: 0,
	videopublisherDataRPP: 5,
	uniqueuserserror: false,
	uniqueusersloading: true,
	uniqueusersdata: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case PUBLISHERDATA_LOADING:
			return {
				...state,
				publisherDataFail: false,
				publisherDataLoading: true
			};
		case UNIQUEUSERSPUBLISHER_LOADED:
			return {
				...state,
				uniqueusersdata: action.payload,
				uniqueusersloading: false
			};
		case UNIQUEUSERSPUBLISHER_LOADING:
			return {
				...state,
				uniqueuserserror: false,
				uniqueusersloading: true
			};
		case PUBLISHERDATA_LOADED:
			return {
				...state,
				publisherDataLoading: false,
				totalpublisherData: action.payload.total,
				CompletepublisherData: action.payload.complete,
				quartileaudiopublisherData: action.payload.caudio,
				quartilevideopublisherData: action.payload.cvideo,
				audiopublisherData: action.payload.audio,
				audiosearchedpublisherData: action.payload.audio,
				displaypublisherData: action.payload.display,
				displaysearchedpublisherData: action.payload.display,
				videopublisherData: action.payload.video,
				videosearchedpublisherData: action.payload.video
			};
		case PUBLISHERDATA_ERROR:
			return {
				...state,
				publisherDataLoading: false,
				publisherDataFail: true
			};
		case UNIQUEUSERSPUBLISHER_ERROR:
			return {
				...state,
				uniqueusersloading: false,
				uniqueuserserror: true
			};
		case PUBLISHERDATA_CLEAR:
			return {
				audiopublisherData: null,
				audiosearchedpublisherData: null,
				displaypublisherData: null,
				displaysearchedpublisherData: null,
				videopublisherData: null,
				videosearchedpublisherData: null,
				publisherDataLoading: true
			};
		case PUBLISHERDATA_PAGINATION_AUDIO:
			return {
				...state,
				audiopublisherDataPagination: action.payload.pagination,
				audiopublisherDataRPP: action.payload.rowspp
			};
		case PUBLISHERDATA_PAGINATION_DISPLAY:
			return {
				...state,
				displaypublisherDataPagination: action.payload.pagination,
				displaypublisherDataRPP: action.payload.rowspp
			};
		case PUBLISHERDATA_PAGINATION_VIDEO:
			return {
				...state,
				videopublisherDataPagination: action.payload.pagination,
				videopublisherDataRPP: action.payload.rowspp
			};
		case PUBLISHERDATA_SEARCH_AUDIO:
			return {
				...state,
				audiosearchedpublisherData: action.payload.ads,
				audiopublisherDataValue: action.payload.value
			};
		case PUBLISHERDATA_SEARCH_DISPLAY:
			return {
				...state,
				displaysearchedpublisherData: action.payload.ads,
				displaypublisherDataValue: action.payload.value
			};
		case PUBLISHERDATA_SEARCH_VIDEO:
			return {
				...state,
				videosearchedpublisherData: action.payload.ads,
				videopublisherDataValue: action.payload.value
			};
		case PUBLISHERDATA_SORT_AUDIO:
			return {
				...state,
				audiopublisherDataordername: action.payload.name,
				audiopublisherDataorderdir: action.payload.direction
			};
		case PUBLISHERDATA_SORT_DISPLAY:
			return {
				...state,
				displaypublisherDataordername: action.payload.name,
				displaypublisherDataorderdir: action.payload.direction
			};
		case PUBLISHERDATA_SORT_VIDEO:
			return {
				...state,
				videopublisherDataordername: action.payload.name,
				videopublisherDataorderdir: action.payload.direction
			};
		default:
			return state;
	}
}
