import { 
    MANAGEADS_LOADING , 
    MANAGEADS_LOADDED , 
    MANAGE_LOAD_ERROR , 
    REPORT_LOADED , 
    REPORT_LOADING , 
    REPORT_ERROR 
} from "../types.js";

const initialState={
    token: localStorage.getItem('jwt'),
    isAuthenticated: null,
    message: null,
    error: null,
    isLoading: true,
    user: null,
    loadfail:null
}

export default function( state = initialState , action ) {
    switch (action.type) {
        case MANAGEADS_LOADING:
            return{
                ...state,
                loadfail:false,
                isLoading:true
            };
        default:
            return state;
    }
}