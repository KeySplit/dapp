import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';
import { bindActionCreators } from 'redux';

class Legal extends Component {

    componentWillMount = () => {
        if (window.web3 !== undefined) {
            this.props.ETHaccount().then( (response) => {
                if(response.account) {
                    if(response.account === 'undefined' || typeof response.account === undefined) {
                        this.props.history.push('/web3');
                    }
                }
            });
        }
    }

    render() {
        return (
            <div className="legal">
                <h1>Privacy Policy &<br/>Terms of Use</h1>
                <a href="https://iubenda.com/privacy-policy/68568284">Privacy Policy</a><br/>
                <Link to="terms">Terms of Use</Link>
                <p>By clicking “Accept”, you confirm that you have read, accepted, and agreed to our privacy policy and terms of use.</p>
                <center><button onClick={() => { this.props.history.push('/create') }} className="create-account">ACCEPT</button></center>
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

export default connect(mapStateToProps, mapDispatchToProps)(Legal);
