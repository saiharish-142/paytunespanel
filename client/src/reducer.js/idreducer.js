export const InitialState1 = null
export const reducer1 = (state, action) => {
    if(action.type==="ID"){
        return action.payload;
    }
    if(action.type==="CLEAR"){
        return null
    }
    return state
}