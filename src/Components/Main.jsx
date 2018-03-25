import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';

class Main extends Component {

    componentWillMount = () => {
        if (window.web3 !== undefined) {
            this.props.ETHaccount().then( (response) => {
                if(response.account){
                    if(localStorage.getItem(`${response.account}:password`) && this.props.location.pathname === "/") {
                        this.props.history.push('/dashboard');
                    } else if(response.account === 'undefined' || typeof response.account === undefined){
                        this.props.history.push('/web3');
                    }
                }
            });
        }
    }
    render() {
        return (
            <div className="landing">
                <h1>KeySplit</h1>
                <p>A simple, secure way to recover your secret keys and passwords</p>
                <a href="https://keysplit.io"><p className="learn-more">Learn More</p></a>
                <button onClick={(e) => {
                    this.props.history.push('terms')
                }} className="create-account">CREATE ACCOUNT</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.web3Reducer.account
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        ETHaccount: bindActionCreators(getETHaccount, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main) 
