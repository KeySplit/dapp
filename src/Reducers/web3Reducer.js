import * as actionType from '../Actions/ActionType';

const web3Reducer = (state = {}, action) => {
    switch (action.type) {
        case actionType.FETCH_ACCOUNT_SUCCESS:
            if(action.account){
                return { ...state, account: action.account};
            } else {
                return null;
            }
            break
        case actionType.HASH_PASS_SUCCESS:
            return {...state, hash: action.hash};
            break   
        case actionType.SET_STEP_1:
            return {...state, address: action.address};
            break
        case actionType.SET_STEP_2:
            return {...state, guardians: action.guardians};
            break
        default:
            return state
            break
    }
}

export default web3Reducer;
