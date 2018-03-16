import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';
import { bindActionCreators } from 'redux';

class Terms extends Component {

    constructor(props) {
        super(props);
    }

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
            <div className="terms">
                <h1>Privacy Polixy &<br/>Terms of Use</h1>
                <Link to="privacy">Privacy Policy</Link><br/>
                <Link to="terms">Terms of Use</Link><br/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Terms);
