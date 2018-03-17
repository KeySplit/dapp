import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';
import { bindActionCreators } from 'redux';
import App from '../Components/App';

class GlobalContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount = () => {
        if (typeof window.web3 === 'undefined' || typeof window.web3 === undefined){
            this.props.history.push('/web3');
        } else {
            this.props.ETHaccount().then( (response) => {
                if(response.account){
                    if(localStorage.getItem(`${response.account}:password`)){
                        this.props.history.push('/dashboard');
                    } else if(response.account === 'undefined'){
                        this.props.history.push('/web3');
                    } else {
                        this.props.history.push('/');
                    }
                }
            });
        }
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
