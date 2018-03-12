import * as actionType from '../Actions/ActionType';

const web3Reducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case actionType.FETCH_ACCOUNT_SUCCESS:
            if(action.account){
                return { ...state, account: action.account };
            }
        case actionType.HASH_PASS_SUCCESS:
            return {...state, hash: action.hash};



        case actionType.SET_STEP_1:
            return {...state, address: action.address};
        case actionType.SET_STEP_2:
            return {...state, guardians: action.guardians};
        default:
            return state
    }
}

export default web3Reducer;
