import secrets from 'secrets.js-next';
import bip39 from 'bip39';
import {entropyToMnemonic} from './wordEncode.js';
import {mnemonicToEntropy} from './wordEncode.js';
import crypto from 'crypto';
import rp from 'request-promise-native';

function repeat(char, number) {
  var string = "";
  for(var i = 0; i < number; i++) {
    string += char;
  }
  return string;
}

class ApiEndpoint {
  constructor(apiServer) {
    this.apiServer = apiServer
  }
  upload(body) {
    return rp({
      method: 'POST',
      uri: this.apiServer,
      body: body,
      json: true
    });
  }
  download(shardid) {
    return rp({
      method: 'GET',
      uri: `${this.apiServer}?id=${shardid}`,
      json: true
    });
  }
}

var passwordStore = {};

class KeySplit {
  constructor(options={}) {
    if(typeof window === "undefined") {
      var window = {};
    }
    this.apiUrl = options.apiUrl || "https://cgr6zthug7.execute-api.us-east-2.amazonaws.com/keysplit";
    this.localStorage = options.localStorage || window.localStorage;
    this.account = options.account;
    passwordStore[this] = options.password;
  }
  mnemonicToSSS(mnemonic, shareCount, threshold, password) {
    password = password || passwordStore[this];
    var key = bip39.mnemonicToEntropy(mnemonic);
    var salt = crypto.randomBytes(8);
    return new Promise((resolve, reject) => {
      return crypto.pbkdf2(password, salt, 100000, 16, 'sha512', (err, pbkdf2Pass) => {
        if(err) { reject(err) }
        var c = crypto.createCipher("aes128", pbkdf2Pass);
        var encKey = c.update(key, 'hex', 'hex');
        encKey += c.final('hex')
        var splitVal = salt.toString("hex") + encKey;
        var shares = secrets.share(splitVal, shareCount, threshold);
        var mnemonicShares = [];
        for(var share of shares) {
          mnemonicShares.push(entropyToMnemonic(share + "000"));
        }
        resolve(mnemonicShares);
      });
    });
  }
  combineSSS(mnemonicShares, password) {
    password = password || passwordStore[this];
    var shares = [];
    for(var share of mnemonicShares) {
      var shareHex = mnemonicToEntropy(share);
      shares.push(shareHex.slice(0, shareHex.length - 3));
    }
    var splitVal = secrets.combine(shares);
    var salt = new Buffer(splitVal.slice(0, 16), "hex");
    var encKey = splitVal.slice(16);
    return new Promise((resolve, reject) => {
      return crypto.pbkdf2(password, salt, 100000, 16, 'sha512', (err, pbkdf2Pass) => {
        if(err) { reject(err) }
        var d = crypto.createDecipher("aes128", pbkdf2Pass);
        var rawKey = d.update(encKey, "hex", "hex");
        rawKey += d.final("hex");
        return bip39.entropyToMnemonic(rawKey);
      });
    })
  }
  uploadShard(shard, uploader) {
    uploader = uploader || new ApiEndpoint(this.apiUrl);
    var hash = crypto.createHash('sha256');
    var shardHex = mnemonicToEntropy(shard);
    hash.update(shardHex, "hex")
    var result = {
      shardid: hash.digest(),
      key: crypto.randomBytes(32),
    }
    var c = crypto.createCipher("aes256", result.key);
    var encShard = c.update(shardHex, "hex", "base64");
    encShard += c.final("base64");
    if(this.localStorage) {
      var shardList = JSON.parse(this.localStorage.getItem(`${this.account}:shards`));
      if(shardList.indexOf(result.shardid.toString("hex")) < 0) {
        shardList.push(result.shardid.toString("hex"));
      }
      this.localStorage.setItem(`${this.account}:shards`, JSON.stringify(shardList));
    }
    return uploader.upload({shardid: result.shardid, data: encShard}).then((response) => {
      result.objectid = response;
      return result
    });
  }
  downloadShard(pathAndKey, downloader) {
    downloader = downloader || new ApiEndpoint(this.apiUrl);
    var objectid, key;
    [objectid, key] = pathAndKey.split(":");
    console.log(pathAndKey);
    return downloader.download(objectid).then((response) => {
      console.log(objectid, key);
      var d = crypto.createDecipher("aes256", new Buffer(key, "base64"));
      var shardHex = d.update(response.data, "base64", "hex");
      shardHex += d.final("hex");
      console.log(entropyToMnemonic(shardHex));
      return entropyToMnemonic(shardHex);
    })
  }
  saveShard(shard, password) {
    return new Promise((resolve, reject) => {
      password = password || passwordStore[this];
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
        this.localStorage.setItem(`encShard:${shardId}`, splitVal);
        var shardList = JSON.parse(this.localStorage.getItem(`${this.account}:heldShards`));
        if(!shardList) {
          shardList = [];
        }
        if(shardList.indexOf(shardId) < 0) {
          shardList.push(shardId);
        }
        this.localStorage.setItem(`${this.account}:heldShards`, JSON.stringify(shardList));
        resolve(shardId);
      });
    });
  }
  getShard(shardId, password) {
    return new Promise((resolve, reject) => {
      var splitVal = this.localStorage.getItem(`encShard:${shardId}`);
      var salt = new Buffer(splitVal.slice(0, 16), "hex");
      var encShard = splitVal.slice(16);
      crypto.pbkdf2(password, salt, 100000, 16, 'sha512', (err, pbkdf2Pass) => {
        if(err) { reject(err) }
        var d = crypto.createDecipher("aes128", pbkdf2Pass);
        var rawShard = d.update(encShard, "hex", "hex");
        rawShard += d.final("hex");
        resolve(bip39.entropyToMnemonic(rawShard));
      });
    })
  }
};

export default KeySplit;
