import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';
import { getWeb3 } from '../Actions';
import { bindActionCreators } from 'redux';
import App from '../Components/App';

class GlobalContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount = () => {
        this.props.ETHaccount().then( (response) => {
            if(response.account){
                if(localStorage.getItem(`${response.account}:password`) && this.props.location.pathname === "/create"){
                    this.props.history.push('/dashboard');
                }
                else if(!localStorage.getItem(`${response.account}:password`)){
                    localStorage.account = response.account;
                    this.props.history.push('/create');
                }
            }
            else{
                console.log("DID NOT GET AN ACCOUNT")
                this.props.history.push('/create');
            }
        });
    }

    render() {
        return (
            <App {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(GlobalContainer);
