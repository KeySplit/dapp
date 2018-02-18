import chai from 'chai';
import KeySplit from '../src/KeySplit.js';
import bip39 from 'bip39';
import uuidv4 from 'uuid/v4';
import {MockLocalStorage} from './hashPassSpec.js';

const expect = chai.expect;

class MockApiEndpoint {
  constructor () {
    this.items = {};
  }
  upload(data) {
    return new Promise((resolve, reject) => {
      var id = uuidv4();
      this.items[id] = data;
      resolve(id);
    })
  }
  download(id) {
    return new Promise((resolve, reject) => {
      if(!this.items[id]) {
        reject("not found");
      }
      resolve(this.items[id]);
    });
  }
}

describe('KeySplit', () => {
  describe('KeySplit.mnemonicToSSS', () => {
    it('should create the number of shares specified for a 128 bit mnemonic', () => {
      var promises = [];
      for(var i = 0; i < 10; i++) {
        var mnemonic = bip39.generateMnemonic();
        promises.push(new KeySplit().mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
          expect(shares).to.have.lengthOf(3);
          for(var share of shares) {
            expect(share.split(" ")).to.have.lengthOf(33);
          }
        }));
      }
      return Promise.all(promises);
    }).timeout(10000);
    it('should create the number of shares specified for a 256 bit mnemonic', () => {
      var promises = [];
      for(var i = 0; i < 10; i++) {
        var mnemonic = bip39.generateMnemonic(256);

        promises.push(new KeySplit().mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
          expect(shares).to.have.lengthOf(3);
          for(var share of shares) {
            expect(share.split(" ")).to.have.lengthOf(45);
          }
        }));
      }
      return Promise.all(promises);
    }).timeout(10000);
  });
  describe('KeySplit.combineSSS', () => {
    it('should create the number of shares specified for a 128 bit mnemonic', () => {
      var promises = [];
      for(var i = 0; i < 10; i++) {
        var mnemonic = bip39.generateMnemonic();
        var ks = new KeySplit();
        ks.mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
          var subPromises = [];
          for(var j = 0; j < 3; j++) {
            for(var k = 0; k < 3; k++) {
              if(j == k) { continue }
              subPromises.push(ks.combineSSS([shares[j], shares[k]], "foo").then((value) => {
                expect(value).to.equal(mnemonic);
              }));
            }
          }
          return Promise.all(subPromises);
        });
      }
      return Promise.all(promises);
    }).timeout(20000);
    it('should create the number of shares specified for a 256 bit mnemonic', () => {
      var promises = [];
      for(var i = 0; i < 10; i++) {
        var mnemonic = bip39.generateMnemonic(256);
        var ks = new KeySplit();
        ks.mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
          var subPromises = [];
          for(var j = 0; j < 3; j++) {
            for(var k = 0; k < 3; k++) {
              if(j == k) { continue }
              subPromises.push(ks.combineSSS([shares[j], shares[k]], "foo").then((value) => {
                expect(value).to.equal(mnemonic);
              }));
            }
          }
          return Promise.all(subPromises);
        });
      }
      return Promise.all(promises);
    }).timeout(20000);
  });
  describe('KeySplit.uploadShard', () => {
    it('should upload a shard', () => {
      var mnemonic = bip39.generateMnemonic();
      return new KeySplit().mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
        var mockEndpoint = new MockApiEndpoint();
        return new KeySplit().uploadShard(shares[0], mockEndpoint).then((result) => {
          expect(result.key).to.have.lengthOf(32);
          expect(result.shardid).to.have.lengthOf(32);
          expect(mockEndpoint.items[result.objectid]).to.not.have.keys("key");
          expect(mockEndpoint.items[result.objectid]).to.have.all.keys("data", "shardid");
        })
      });
    })
  });
  describe('KeySplit.downloadShard', () => {
    it('should upload a shard', () => {
      var mnemonic = bip39.generateMnemonic();
      var ks = new KeySplit();
      ks.mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
        var mockEndpoint = new MockApiEndpoint();
        return ks.uploadShard(shares[0], mockEndpoint).then((result) => {
          var pathAndKey = `${result.objectid}:${result.key.toString("base64")}`;
          return ks.downloadShard(pathAndKey, mockEndpoint).then((shard) => {
            expect(shard).to.equal(shares[0]);
          })
        })
      });
    })
  });
  describe('KeySplit.saveShard', () => {
    it('should save a shard', () => {
      var mnemonic = bip39.generateMnemonic();
      var ks = new KeySplit({localStorage: new MockLocalStorage()});
      ks.mnemonicToSSS(mnemonic, 3, 2, "foo").then((shares) => {
        var mockEndpoint = new MockApiEndpoint();
        return ks.saveShard(shares[0], "foo").then((shardId) => {
          return ks.getShard(shardId, "foo").then((shard) => {
            expect(shard).to.be.equal(shares[0]);
          })
        })
      });
    })
  });
});
