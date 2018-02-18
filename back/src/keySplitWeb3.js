
import ShardStore from "../solidity/build/contracts/ShardStore.json";

import BigNumber from "bignumber.js";

export class KeySplitContractInterface {
  constructor (options={}) {
    this.web3 = options.web3;
    this.contract = this.web3.eth.contract(ShardStore.abi).at(options.at || "0x8cdaf0cd259887258bc13a92c0a6da92698644c0");
    this.localStorage = options.localStorage;
    if(this.localStorage) {
      this.web3.eth.getAccounts((err, accounts) => {
        this.account = accounts[0];
        var shardList = JSON.parse(this.localStorage.getItem(`${accounts[0]}:shards`));
        if(!shardList) { shardList = []; }
        for(var shard of shardList) {
          getStorageConfirmed(shard);
        }
      });
    }
  }

  stop() {
    if(this.engine) {
      this.engine.stop();
    }
  }

  deploy() {
    this.web3.eth.getAccounts((err, accounts) => {
      if(err) {
        console.log(err);
        return;
      }
      var defaultAccount = accounts[0];
      this.web3.eth.contract(ShardStore.abi).new({data: ShardStore.bytecode, gas: 1000000, from: defaultAccount}, (err, data) => {
        console.log(data);
      });
    })
  }

  confirmStorage(shardIds) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if(err) { reject(err); return; }
        var defaultAccount = accounts[0];
        var shardNumbers = [];
        for(var shardId of shardIds){
          shardNumbers.push(new BigNumber(shardId, 16));
        }
        console.log(shardNumbers);
        this.contract.confirmStorage.estimateGas(shardNumbers, {from: defaultAccount}, (err, gas) => {
          this.contract.confirmStorage(shardNumbers, {from: defaultAccount, gas: gas}, (err, tx) => {
            if(err) {
              reject(err);
              return;
            }
            resolve(tx);
          });
        })
      });
    })
  }

  watchStorageConfirmed(shardId) {
    return new Promise((resolve, reject) => {
      var watcher = this.contract.StorageConfirmed({fromBlock: "latest", shardId: new BigNumber(shardId, 16)});
      watcher.watch((err, evt) => {
        if(err) {
          watcher.stopWatching(() => {});
          reject(err)
        }
        watcher.stopWatching(() => {});
        if(this.localStorage) {
          this.localStorage.setItem(`shard:${shardId}`, JSON.stringify({block: evt.blockNumber, trustedContact: evt.args.trustedContact}));
        }
        resolve({block: evt.blockNumber, trustedContact: evt.args.trustedContact});
      });
    });
  }

  getStorageConfirmed(shardId) {
    if(this.localStorage) {
      var shardData = JSON.parse(this.localStorage.getItem(`shard:${shardId}`));
    } else {
      var shardData = {block: 0};
    }
    return new Promise((resolve, reject) => {
      var watcher = this.contract.StorageConfirmed({fromBlock: shardData.block, shardId: new BigNumber(shardId, 16)});
      watcher.get((err, evts) => {
        if(err) {
          reject(err)
        }
        for(var evt of evts) {
          if(evt.blockNumber > shardData.block) {
            if(this.localStorage) {
              this.localStorage.setItem(`shard:${shardId}`, JSON.stringify({block: evt.blockNumber, trustedContact: evt.args.trustedContact}));
            }
            resolve({block: evt.blockNumber, trustedContact: evt.args.trustedContact});
          }
        }
      });
    });
  }
  getShardStatus() {
    return new Promise((resolve, reject) => {
      if(!this.localStorage) {
        resolve([]);
      }
      this.web3.eth.getAccounts((err, accounts) => {
        var shardJSON = this.localStorage.getItem(`${accounts[0]}:shards`);
        if(!shardJSON) {
          reject("No shards yet");
        }
        var shardIds = JSON.parse(shardJSON);
        var shards = [];
        for(var shardId of shardIds) {
          var shard = JSON.parse(this.localStorage.getItem(`shard:${shardId}`));
          shard.update = this.watchStorageConfirmed(shardId);
        }
        resolve(shards);
      });
    })
  }
  getHeldShards() {
    return JSON.parse(this.localStorage.getItem(`${this.account}:heldShards`));
  }
  confirmStoredShards() {
    return new Promise((resolve, reject) => {
      if(!this.localStorage) {
        resolve([]);
      }
      var heldShards = JSON.parse(this.localStorage.getItem(`${this.account}:heldShards`));
      var currentShards = [];
      for(var shardId of heldShards) {
        if(this.localStorage.getItem(`encShard:${shardId}`)) {
          currentShards.push(shardId);
        }
      }
      resolve(this.confirmStorage(currentShards));
    });
  }



}
