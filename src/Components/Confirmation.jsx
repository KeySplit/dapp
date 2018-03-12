import React, { Component } from 'react';
import KeySplit from '../Keysplit/KeySplit';
import {mnemonicToEntropy} from '../Keysplit/wordEncode.js';
import crypto from 'crypto';


class Confirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            save: "Shard is getting verified...",
            ks: new KeySplit({account: localStorage.account, password: localStorage.getItem(`${localStorage.account}:password`), localStorage: localStorage}),
        }
    }

    componentDidMount = () =>{
        const hash = this.props.location.search.substr(6)

        if(!hash) {
            console.log("error")
            this.props.history.push('/create')
        }
        else{
            console.log(hash);
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
                if(shardList.indexOf(shardId) < 0) {
                    shardList.push(shardId);
                }
                localStorage.setItem(`${localStorage.account}:heldShards`, JSON.stringify(shardList));
                this.setState({
                    save: "The Shard has been decrypted and saved successfully!"
                })
                resolve(shardId);
                this.props.history.push('/dashboard')

            });
        });
    }

    render() {
        return (
            <div className="confirmation">
                <center><h3>{this.state.save}</h3></center>
            </div>
        )
    }
}

export default Confirmation;
