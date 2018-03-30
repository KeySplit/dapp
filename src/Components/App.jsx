import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import Terms from './Terms';
import Create from './Create';
import Legal from './Legal';
import Dashboard from './Dashboard';
import NoWeb3 from './NoWeb3';
import Wallet from './Wallet';
import Recover from './Recover';
import Confirmation from './Confirmation';
import StepsContainer from '../Containers/StepsContainer';

import {
    Route
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className="main-container">
                <Route path ="*" component={Header}/>
                <div className="main">
                    <div className="fl">
                        <div className="fl-100">
                            <Route exact path="/" component={Main}/>
                            <Route exact path="/web3" component={NoWeb3}/>
                            <Route exact path="/terms" component={Terms}/>
                            <Route exact path="/create" component={Create}/>
                            <Route exact path="/legal" component={Legal}/>
                            <Route exact path="/dashboard" component={Dashboard}/>
                            <Route exact path="/recover" component={Recover}/>
                            <Route path="/add-key" component={StepsContainer}/>
                            <Route path="/wallet/:name" component={Wallet}/>
                            <Route path="/confirm" component={Confirmation}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
