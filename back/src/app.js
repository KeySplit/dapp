import KeySplit from './KeySplit.js';
import {PasswordManagement} from './hashPass.js';
import {KeySplitContractInterface} from './keySplitWeb3.js';

import Web3 from "web3";
import ProviderEngine from "web3-provider-engine";
import FixtureSubprovider from "web3-provider-engine/subproviders/fixture.js";
import FilterSubprovider from "web3-provider-engine/subproviders/filters.js";
import WalletSubprovider from "ethereumjs-wallet/provider-engine";
import Web3Subprovider from "web3-provider-engine/subproviders/web3.js";

import Wallet from "ethereumjs-wallet";


export class App {
  /*
   * Construct with {}
   */
  constructor(options={}) {
    var rpcURL = options.rpcURL || "https://ropsten.infura.io/atjfYkLXBNdLI0zSm9eE"
    if(typeof window === 'undefined') {
      var window = {};
    }
    this.localStorage = options.localStorage || window.localStorage;
    if(options.currentProvider) {
      this.web3 = new Web3(options.currentProvider);
    } else if(window && window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      var privateKey = options.privateKey || localStorage.getItem("localPrivateKey");
      if(!privateKey) {
        privateKey = Wallet.generate().getPrivateKeyString().slice(2);
        if(localStorage) {
        localStorage.setItem("localPrivateKey", privateKey)}
      }
      var wallet = Wallet.fromPrivateKey(new Buffer(privateKey, "hex"));
      this.engine = new ProviderEngine();
      this.web3 = new Web3(this.engine);
      // static results
      this.engine.addProvider(new FixtureSubprovider({
        web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
        net_listening: true,
        eth_hashrate: '0x00',
        eth_mining: false,
        eth_syncing: true,
      }))

      // filters
      this.engine.addProvider(new FilterSubprovider())

      // id mgmt
      this.engine.addProvider(new WalletSubprovider(wallet, {}))

      this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(rpcURL)));

      this.engine.on('block', function(block) {
        console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
      })

      // network connectivity error
      this.engine.on('error', function(err){
        // report connectivity errors
        console.error(err.stack)
      });

      // start polling for blocks
      this.engine.start()
    }
    this.PasswordManagement = new PasswordManagement(this.localStorage);
    this.ContractInterface = new KeySplitContractInterface({web3: this.web3, at: options.at});
    this.KeySplitPromise = new Promise((resolve, reject) => {
      this.ksResolve = resolve;
      this.ksReject = reject;
    });

    this.account = new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if(err) { reject(err) }
        resolve(accounts[0]);
      })
    })
  }
  hasAccount() {
    return this.account.then((account) => {
      return this.PasswordManagement.hasAccountPass(account);
    })
  }
  signUp(password) {
    return this.account.then((account) => {
      this.ksResolve(new KeySplit({account: account, password: password}));
      return this.PasswordManagement.storePass(password, account);
    })
  }
  signIn(password) {
    return this.account.then((account) => {
      var result = this.PasswordManagement.checkAccountPass(password, account);
      result.then(() => {
        this.ksResolve(new KeySplit({account: account, password: password}));
      });
      return result
    })
  }
  confirmFromUrlHash() {
    return new Promise((resolve, reject) => {
      var hash = window.location.hash.slice(1);
      if(!hash) {
        reject("No shard in url");
      }
      this.KeySplitPromise.then((KeySplit) => {
        return KeySplit.downloadShard(hash).then((shardMnemonic) => {
          return KeySplit.saveShard(shardMnemonic)
        })
      }).then((shardId) => {
        return this.KeySplitContractInterface.confirmStoredShards();
      })
    })
  }
  splitSeedAndUpload(seed) {
    this.KeySplitPromise.then((KeySplit) => {
      return KeySplit.mnemonicToSSS(seed, 5, 3).then((mnemonicShards) => {
        var shards = [];
        for(var shard of mnemonicShards) {
          shards.push(KeySplit.uploadShard(shard));
        }
        return Promise.all(shards);
      });
    }).then((results) => {
      var urls = [];
      for(var result of results) {
        urls.push(`${window.location.origin}${window.location.pathame}#${result.objectid}:${result.key.toString("base64")}`);
      }
      return urls;
    })
  }
  distributedShardData() {
    return this.KeySplitContractInterface.getShardStatus()
  }
  heldShardData() {
    return getHeldShards();
  }
  getShardMnemonic(shardId) {
    return this.KeySplitContractInterface.getShard(shardId);
  }
  currentBlock() {
    return new Promise((resolve, reject) => {
      this.web3.getBlockNumber((err, blocknum) => {
        if(err) { reject(err) }
        resolve(blocknum);
      })
    });
  }
}
