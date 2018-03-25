import React, { Component } from 'react';
import KeySplit from '../Keysplit/KeySplit';
import {mnemonicToEntropy} from '../Keysplit/wordEncode.js';
import crypto from 'crypto';


class Confirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            saved: false,
            ks: new KeySplit({account: localStorage.account, password: localStorage.getItem(`${localStorage.account}:password`), localStorage: localStorage}),
        }
    }

    componentWillMount = () =>{
        const hash = this.props.location.search.substr(6)
        if(!hash) {
            this.props.history.push('/create')
        } else {
            return this.state.ks.downloadShard(hash).then((shardMnemonic) => {
                return this.saveShard(shardMnemonic, localStorage.getItem(`${localStorage.account}:password`))
                .then((shardId) => {
                    console.log(shardId);
                })
            })
        }
    }

    saveShard = (shard, password) => {
        return new Promise((resolve, reject) => {
            var salt = crypto.randomBytes(8);
            crypto.pbkdf2(password, salt, 100000, 16, 'sha512', (err, pbkdf2Pass) => {
                if(err) { reject(err); return }
                var c = crypto.createCipher("aes128", pbkdf2Pass);
                var shardHex = mnemonicToEntropy(shard);
                var encShard = c.update(shardHex, 'hex', 'hex');
                encShard += c.final('hex');
                var splitVal = salt.toString("hex") + encShard;
                var hash = crypto.createHash('sha256');
                hash.update(shardHex, "hex")
                var shardId = hash.digest("hex");
                localStorage.setItem(`encShard:${shardId}`, splitVal);
                var shardList = JSON.parse(localStorage.getItem(`${localStorage.account}:heldShards`));
                if(!shardList) {
                    shardList = [];
                }
                if(shardList.indexOf(shardHex) < 0) {
                    shardList.push(shardHex);
                }
                localStorage.setItem(`${localStorage.account}:heldShards`, JSON.stringify(shardList));
                this.setState({
                    saved: true
                })
                resolve(shardId);
            });
        });
    }

    render() {
        let panel = null;
        if(this.state.saved) {
            panel =
            <center>
                <h3>The shard has been saved.</h3>
                <h4>Check out your Key Ring to view your shards.</h4>
                <div className="fl-row">
                    <div className="fl-100">
                        <img alt="" height="100px" src={require("../Assets/images/dashboard/happy_logo.png")} />
                    </div>
                </div>
                <button onClick={() => { this.props.history.push('/dashboard') }} className="confirm">DONE</button>
            </center>
        } else {
            panel = 
            <center>
                <h3>Verifying shard...</h3>
            </center>
        }
        return (
            <div className="confirmation">
                {panel}
            </div>
        )
    }
}

export default Confirmation;
