import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashPass } from '../Actions';
import { getETHaccount } from '../Actions';
import KeySplit from '../Keysplit/KeySplit';
import {entropyToMnemonic} from '../Keysplit/wordEncode.js';

class Recover extends Component {

    state = { 
        errors: [],
        shares: [],
        ks: new KeySplit({account: localStorage.account, password: localStorage.getItem(`${localStorage.account}:password`), localStorage: localStorage})
    };

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

    handleShard = (e) => {
        e.preventDefault();
        let shares = this.state.shares;
        let name = e.target.name;
        let value = e.target.value;
        shares[name] = value;
        this.setState({ 
            shares: shares
        });
    }

    handlePass = (e) => {
        e.preventDefault();
        this.setState({ password: e.target.value });
    }

    recoverKey = (e) =>{
        e.preventDefault();
        if(this.state.password.length < 12) {
            this.setState({errors: "Oops! Your password must be a minimum of 12 characters."});
        } else {
            let shards = [];
            for (var shard in this.state.shares) {
                shards.push(entropyToMnemonic(this.state.shares[shard]));
            }

            console.log(shards);

            this.props.hashPass(this.state.password)
            .then((result) => {
                return this.state.ks.combineSSS(shards, localStorage.getItem(`${localStorage.account}:password`))
                .then((mnemonic) => {
                    console.log(mnemonic);
                    this.setState({ errors: "" });
                })
            });
        }
    }

    render() {
        return (
            <div className="recover">
                <h1>Recover Key</h1>
                <p>Enter 3 of any 5 shards, as well as your password, in order to recover your key.</p>
                <div className="fl-row">
                    <div className="fl-offset-5 fl-90">
                        <h4>Enter Shards</h4>
                        <input placeholder="Shard 1" type="text" name="shard1" onChange={ this.handleShard.bind(this) } />
                        <input placeholder="Shard 2" type="text" name="shard2" onChange={ this.handleShard.bind(this) } />
                        <input placeholder="Shard 3" type="text" name="shard3" onChange={ this.handleShard.bind(this) } />
                        <h4>Enter Password</h4>
                        <input placeholder="Password (min 12 characters)" onChange={ this.handlePass.bind(this) } type="password" name="password" />
                    </div>
                </div>
                <center><div className="errors">{ this.state.errors }</div></center>
                <center><button onClick={ this.recoverKey.bind(this) } className="recover-key">RECOVER</button></center>
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

export default connect(mapStateToProps, mapDispatchToProps)(Recover);
