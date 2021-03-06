import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddKey from '../Components/AddKey';
import * as actions from '../Actions';
import KeySplit from '../Keysplit/KeySplit';

class StepsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mnemonic: null,
            key: null,
            ks: new KeySplit({account: localStorage.account, password: localStorage.getItem(`${localStorage.account}:password`), localStorage: localStorage}),
            account: localStorage.account,
            password: localStorage.getItem(`${localStorage.account}:password`)
        }
    }

    changeStep = (data, step) =>{
        if(step === 1){
            this.props.step1(data);
            this.setState({mnemonic: data.seed, key: data.nickname});
            this.props.history.push('/add-key/step2');
        } else if(step === 2){
            let shards = [];
            let urls = [];
            localStorage.setItem(`${localStorage.account}:shards`, "[]");
            return this.state.ks.mnemonicToSSS(this.state.mnemonic, 5, 3, this.state.password)
            .then((mnemonicShards) => {
                for(var shard of mnemonicShards){
                    shards.push( this.state.ks.uploadShard(shard) );
                }
                return Promise.all(shards);
            })
            .then((results) => {
                for(let x = 0; x < results.length; x++){
                    let url = `${window.location.origin}/confirm?hash=${results[x].objectid.objectid}:${results[x].key.toString("base64")}`;
                    urls.push(url);
                    data.guardians[x].url = url;
                }

                let keyId = JSON.stringify({nickname: this.state.key, guardians: data.guardians});
                var pkeys = JSON.parse(localStorage.getItem(`${localStorage.account}:pkeys`));
                if(!pkeys) {
                    pkeys = [];
                }
                if(pkeys.indexOf(keyId) < 0) {
                    pkeys.push(keyId);
                }
                localStorage.setItem(`${localStorage.account}:pkeys`, JSON.stringify(pkeys));
                this.props.step2(data.guardians);
                this.props.history.push('/add-key/step3');
                return urls;
            })
        }
    }

    render() {
        return (
            <AddKey {...this.props} changeStep={this.changeStep} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.web3Reducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        step1: bindActionCreators(actions.setStep1, dispatch),
        step2: bindActionCreators(actions.setStep2, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StepsContainer);
