import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import './Assets/styles/index.scss';

import registerServiceWorker from './registerServiceWorker';

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './Reducers';
// import App from './Components/App';
import GlobalContainer from './Containers/GlobalContainer';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);

ReactDOM.render(

    <Provider store={store}>
        <BrowserRouter>
            <Route path="/" component={GlobalContainer} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
