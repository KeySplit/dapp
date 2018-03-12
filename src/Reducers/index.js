import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';

const counterApp = combineReducers({
    web3Reducer
})

export default counterApp;
