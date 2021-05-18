import { 
    USER_LOADING , 
    USER_LOADED , 
    AUTH_ERROR , 
    LOGIN_SUCCESS , 
    LOGIN_FAIL , 
    LOAD_USER_FAIL ,
    LOGOUT_SUCCESS ,
    NETWORK_ERROR
} from "../types.js";

const initialState={
    token: localStorage.getItem('jwt'),
    isAuthenticated: null,
    message: null,
    error: null,
    isLoading: true,
    user: null,
    networkError:null
}

export default function( state = initialState , action ) {
    switch (action.type) {
        case USER_LOADING:
            return{
                ...state,
                isLoading:true
            };
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated:true,
                isLoading:false,
                user:action.payload
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('jwt', action.payload.token )
            return{
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false,
                user:action.payload.user,
                message:action.payload.message
            };
        case LOAD_USER_FAIL:
            return{
                ...state,
                isAuthenticated:true,
                isLoading:false,
                error:'Failed to load Try again'
            }
        case NETWORK_ERROR:
            return{
                networkError:true
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('jwt')
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            };
        default:
            return state;
    }
}