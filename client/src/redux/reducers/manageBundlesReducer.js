import {
	MANAGEBUNDLES_LOADING,
	MANAGEBUNDLES_LOADDED,
	MANAGEBUNDLES_LOAD_ERROR,
	MANAGEBUNDLES_SEARCH,
	MANAGEBUNDLES_SORT_NAME
} from '../types.js';

const initialState = {
	managebundles: null,
	searchedmanagebundles: null,
	ordername: 'remainingDays',
	orderdir: 'asc',
	message: null,
	error: null,
	isLoading: true,
	loadfail: null,
	value: ''
};

export default function(state = initialState, action) {
	switch (action.type) {
		case MANAGEBUNDLES_LOADING:
			return {
				...state,
				loadfail: false,
				isLoading: true
			};
		case MANAGEBUNDLES_LOADDED:
			return {
				...state,
				isLoading: false,
				managebundles: action.payload,
				searchedmanagebundles: action.payload
			};
		case MANAGEBUNDLES_LOAD_ERROR:
			return {
				...state,
				isLoading: false,
				loadfail: true
			};
		case MANAGEBUNDLES_SORT_NAME:
			return {
				...state,
				ordername: action.payload.name,
				orderdir: action.payload.direction,
				managebundles: action.payload.adss,
				searchedmanagebundles: action.payload.searchadss
			};
		case MANAGEBUNDLES_SEARCH:
			return {
				...state,
				searchedmanagebundles: action.payload.ads,
				value: action.payload.value
			};
		default:
			return state;
	}
}
