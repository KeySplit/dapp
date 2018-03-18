import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashPass } from '../Actions';
import { getETHaccount } from '../Actions';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import KeySplit from '../Keysplit/KeySplit';
import {entropyToMnemonic} from '../Keysplit/wordEncode.js';

class Recover extends Component {

    state = { 
        errors: [],
        shares: [],
        password: localStorage.getItem(`${localStorage.account}:password`),
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

    recoverKey = (e) =>{
        e.preventDefault();
        if(Object.keys(this.state.shares).length < 3) {
            this.setState({errors: "Oops! You must enter at least 3 shards."});
        } else {
            let shards = [];
            for (var shard in this.state.shares) {
                shards.push(entropyToMnemonic(this.state.shares[shard]));
            }
            this.state.ks.combineSSS(shards, localStorage.getItem(`${localStorage.account}:password`)).then((mnemonic) => {
                this.setState({ 
                    errors: "",
                    mnemonic: mnemonic
                });
            })
        }
    }

    render() {
        let panel = null;
        if(!this.state.mnemonic) {
            panel =             
            <div>
                <h1>Recover Key</h1>
                <p>Enter any 3 of the 5 shards in order to recover your key.</p>
                <div className="fl-row">
                    <div className="fl-offset-5 fl-90">
                        <h4>Enter Shards</h4>
                        <input placeholder="Shard 1" type="text" name="shard1" onChange={ this.handleShard.bind(this) } />
                        <input placeholder="Shard 2" type="text" name="shard2" onChange={ this.handleShard.bind(this) } />
                        <input placeholder="Shard 3" type="text" name="shard3" onChange={ this.handleShard.bind(this) } />
                    </div>
                </div>
                <center><div className="errors">{ this.state.errors }</div></center>
                <center><button onClick={ this.recoverKey.bind(this) } className="recover-key">RECOVER</button></center>
            </div>
        }
        else{
            panel = <RecoveredPanel mnemonic={this.state.mnemonic} history={this.props.history} />
        }
        return (
            <div className="recover">
                {panel}
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

class RecoveredPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Your Key</h1>
                <CopyToClipboard text={this.props.mnemonic}>
                    <span><p>{this.props.mnemonic}</p></span>
                </CopyToClipboard>
                <center><button onClick={() => { this.props.history.push('/dashboard') }} className="done">DONE</button></center>
            </div>
        );
    }
}
