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

/*
 * The 'App' class is supposed to map the underlying building blocks into
 * function calls that correspond to frontend functionality. This whole thing
 * should probably be replaced with some Angular controllers or something, I
 * was just trying to get something Mark could wire up to the frontend as he
 * was ready.
 */

export class App {
  /**
   * constructor()
   * @param {object} - options
   * @param {string} - options.rpcURL - The URL of an RPC server for use with a ZeroClient web3, if applicable
   * @param {object} - options.localStorage - A localStorage object providing getItem and setItem. This should fall back to window.localStorage, but that's not working. The intent was that a mock localStorage object could be passed for testing on node, but it never detects window.localStorage
   * @param {web3Provider} - options.currentProvider - A web3 provider to use instead of constructing our own.
   * @param {string} - options.privateKey - A hex encoded Ethereum private key. Only used if currentProvider is not specified. If not provided, looks in localStorage for a private key. If not found, generates one, and stores in localStorage
   **/
  constructor(options={}) {
    var rpcURL = options.rpcURL || "https://ropsten.infura.io/atjfYkLXBNdLI0zSm9eE"
    if(typeof window === 'undefined') {
      var window = {};
    }
    // BUG: This is never finding window.localStorage, so it must be passed as options.localStorage
    this.localStorage = options.localStorage || window.localStorage;
    if(options.currentProvider) {
      this.web3 = new Web3(options.currentProvider);
    } else if(window && window.web3) {
      // BUG: This never finds window.web3, and thus always falls back to localStorage keys
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      var privateKey = options.privateKey || localStorage.getItem("localPrivateKey");
      if(!privateKey) {
        privateKey = Wallet.generate().getPrivateKeyString().slice(2);
        if(localStorage) {
        localStorage.setItem("localPrivateKey", privateKey)}
      }
      // This uses web3-provider-engine and ethereumjs-wallet to construct a
      // wallet in-browser, without needing Metamask, Toshi, etc.
      //
      // Note that the current version of ethereumjs-wallet on npm has a bug,
      // but the latest on Github works just fine.
      var wallet = Wallet.fromPrivateKey(new Buffer(privateKey, "hex"));
      this.engine = new ProviderEngine();
      this.web3 = new Web3(this.engine);
      console.log(this.web3)
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
        // We probably don't need to be spamming this to the console, but it's useful for debugging.
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
    this.ContractInterface = new KeySplitContractInterface({web3: this.web3, at: options.at, localStorage: this.localStorage});
    this.KeySplitPromise = new Promise((resolve, reject) => {
      // The KeySplit library can't be constructed until we have our account
      // from web3 and a password which must be resolved asynchronously, so it
      // will be made available by these promises.
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
    // This is a promise to tell us if we've previously saved a user account
    // in localStorage.
    return this.account.then((account) => {
      return this.PasswordManagement.hasAccountPass(account);
    })
  }
  signUp(password) {
    // First sign up, construct a KeySplit object, resolve the KeySplit
    // promise, and store the password in localStorage.
    return this.account.then((account) => {
      this.ksResolve(new KeySplit({account: account, password: password, localStorage: this.localStorage}));
      return this.PasswordManagement.storePass(password, account);
    })
  }
  signIn(password) {
    // Subsequent sign in, check the password. If it succeeds, construct a
    // KeySplit object.
    return this.account.then((account) => {
      var result = this.PasswordManagement.checkAccountPass(password, account);
      result.then(() => {
        this.ksResolve(new KeySplit({account: account, password: password, localStorage: this.localStorage}));
      });
      return result
    })
  }
  confirmFromUrlHash() {
    // If the hash component of the URL is present, we try to download the
    // specified shard, decrypt it, save it to localStorage, and prompt the
    // user to send a confirmation to the contract for this shard
    // NOTE: It is important that the encryption key is in the hash, as that is
    // not sent to the server when the user comes to the page. It wouldn't be a
    // big deal for the shard ID to be in the earlier part of the URL, if that
    // makes sense in a refactor.
    var hash = window.location.hash.slice(1);
    if(!hash) {
        console.log("no hash")
    }
    // Get the KeySplitPromise, which is asynchronous
    return this.KeySplitPromise.then((KeySplit) => {
      // Download the shard acording to the hash portion of the URL
      return KeySplit.downloadShard(hash).then((shardMnemonic) => {
        console.log("got here mnemonic");
        // Save the mnemonic to localStorage. It will be encrypted with the
        // user's password.
        return KeySplit.saveShard(shardMnemonic)
      })
    }).then((shardId) => {
      console.log("got here");
      // Call the Ethereum contract to notify others of the confimed shard.
      return this.ContractInterface.confirmStoredShards();
    })
  }
  splitSeedAndUpload(seed) {
    // Given a seed, split it into 5 parts, then encrypt the shards and upload
    // them to our web service. Ultimately, we return a list of 5 URLs for this
    // app, which will prompt the confirmFromUrlHash when a user arrives at
    // them and force a download.
    return this.KeySplitPromise.then((KeySplit) => {
      // Split the key into 5 shards, 3 being necessary to recreate the key
      return KeySplit.mnemonicToSSS(seed, 5, 3).then((mnemonicShards) => {
        var shards = [];
        for(var shard of mnemonicShards) {
          // uploadShard will encrpyt the key and upload it to our web service
          // The return value will be the shardid, the objectid for downloading
          // the shard, and the encryption key for decrypting the shard.
          shards.push(KeySplit.uploadShard(shard));
        }
        // Return a promise for all shards
        return Promise.all(shards);
      });
    }).then((results) => {
      var urls = [];
      for(var result of results) {
        // Convert each of the uploadShard() results to a URL that can be
        // passed to the guardians
        urls.push(`${window.location.origin}${window.location.pathname}#${result.objectid.objectid}:${result.key.toString("base64")}`);
      }
      return urls;
    })
  }
  distributedShardData() {
    // I don't think we're actually using this. It returns the information we
    // have about shards we created from our seed words. At the moment, we know
    // about all the shards we've created, but we don't have anything to
    // correlate which shards came from the same keys, which we probably need
    // to fix.
    return this.ContractInterface.getShardStatus()
  }
  heldShardData() {
    // I don't think we're actually using this, either. It returns information
    // we have about shards we received from others. At the moment all we have
    // is the shard ID and the shard encrypted with our password. No
    // information about who sent it to us, for example.
    // return getHeldShards();
  }
  getShardMnemonic(shardId) {
    // Given a shardId, get the shard mnemonic from localStorage. This will
    // take care of decrypting the shard with the password the user used to
    // login.
    return this.ContractInterface.getShard(shardId);
  }
  currentBlock() {
    // When we get an event log that a shard was confirmed, we only have easy
    // access to the block number. To determine the age of the shard, we need
    // the current block number. It wouldn't be that hard to look up block
    // times, but would be an extra call after an event. That's probably the
    // better way to go, but we were cutting corners in the hackathon due to
    // time constraints, and actually didn't even get to the point where we're
    // using this.
    return new Promise((resolve, reject) => {
      this.web3.getBlockNumber((err, blocknum) => {
        if(err) { reject(err) }
        resolve(blocknum);
      })
    });
  }
}
