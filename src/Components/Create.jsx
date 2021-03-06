import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashPass } from '../Actions';
import { getETHaccount } from '../Actions';

class Create extends Component {

    state = { errors: [] };

    componentWillMount = () => {
        if (window.web3 !== undefined) {
            this.props.ETHaccount().then( (response) => {
                if(response.account){
                    if(localStorage.getItem(`${response.account}:password`) && this.props.location.pathname === "/create"){
                        this.props.history.push('/dashboard');
                    } else if(response.account === 'undefined' || typeof response.account === undefined){
                        this.props.history.push('/web3');
                    }
                }
            });
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ password: e.target.value });
    }

    createPass = () => {
        if(this.state.password) {
            if(this.state.password.length < 12){
                this.setState({errors: "Oops! Your password must be a minimum of 12 characters."});
            }
            else{
                this.props.hashPass(this.state.password)
                .then((result) => {
                    localStorage.setItem('account', this.props.account);
                    localStorage.setItem(`${this.props.account}:password`, result.hash.hash);
                    this.setState({ errors: "" });
                    this.props.history.push('/dashboard')
                });
            }
        }
    }

    render() {
        return (
            <div className="create">
                <h1>Create Account</h1>
                <p>Your wallet address is your username.</p>
                <p>Your address: <span className="account">{ this.props.account }</span></p>
                <div className="fl-row">
                    <div className="fl-offset-10 fl-80">
                        <h4>Create Password</h4>
                        <input placeholder="Password (min 12 characters)" onChange={ this.handleChange } type="password" name="password" />
                    </div>
                </div>
                <center><div className="errors">{ this.state.errors }</div></center>
                <center><button onClick={ this.createPass } className="create-account">CREATE ACCOUNT</button></center>
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
        hashPass: bindActionCreators(hashPass, dispatch),
        ETHaccount: bindActionCreators(getETHaccount, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
