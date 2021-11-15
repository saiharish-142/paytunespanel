export const InitialState2 = null
export const reducer2 = (state, action) => {
    if(action.type==="ID"){
        return action.payload;
    }
    if(action.type==="CLEAR"){
        return null
    }
    return state
}