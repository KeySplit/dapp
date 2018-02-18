(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('secrets.js-next'), require('bip39'), require('create-hash'), require('unorm'), require('crypto'), require('request-promise-native'), require('bignumber.js'), require('web3'), require('web3-provider-engine'), require('web3-provider-engine/subproviders/fixture.js'), require('web3-provider-engine/subproviders/filters.js'), require('ethereumjs-wallet/provider-engine'), require('web3-provider-engine/subproviders/web3.js'), require('ethereumjs-wallet')) :
  typeof define === 'function' && define.amd ? define(['exports', 'secrets.js-next', 'bip39', 'create-hash', 'unorm', 'crypto', 'request-promise-native', 'bignumber.js', 'web3', 'web3-provider-engine', 'web3-provider-engine/subproviders/fixture.js', 'web3-provider-engine/subproviders/filters.js', 'ethereumjs-wallet/provider-engine', 'web3-provider-engine/subproviders/web3.js', 'ethereumjs-wallet'], factory) :
  (factory((global.KeySplit = global.KeySplit || {}, global.KeySplit.js = global.KeySplit.js || {}),global.secrets,global.bip39,global.createHash,global.unorm,global.crypto,global.rp,global.BigNumber,global.Web3,global.ProviderEngine,global.FixtureSubprovider,global.FilterSubprovider,global.WalletSubprovider,global.Web3Subprovider,global.Wallet));
}(this, (function (exports,secrets,bip39,createHash,unorm,crypto,rp,BigNumber,Web3,ProviderEngine,FixtureSubprovider,FilterSubprovider,WalletSubprovider,Web3Subprovider,Wallet) { 'use strict';

secrets = 'default' in secrets ? secrets['default'] : secrets;
bip39 = 'default' in bip39 ? bip39['default'] : bip39;
createHash = 'default' in createHash ? createHash['default'] : createHash;
unorm = 'default' in unorm ? unorm['default'] : unorm;
crypto = 'default' in crypto ? crypto['default'] : crypto;
rp = 'default' in rp ? rp['default'] : rp;
BigNumber = 'default' in BigNumber ? BigNumber['default'] : BigNumber;
Web3 = 'default' in Web3 ? Web3['default'] : Web3;
ProviderEngine = 'default' in ProviderEngine ? ProviderEngine['default'] : ProviderEngine;
FixtureSubprovider = 'default' in FixtureSubprovider ? FixtureSubprovider['default'] : FixtureSubprovider;
FilterSubprovider = 'default' in FilterSubprovider ? FilterSubprovider['default'] : FilterSubprovider;
WalletSubprovider = 'default' in WalletSubprovider ? WalletSubprovider['default'] : WalletSubprovider;
Web3Subprovider = 'default' in Web3Subprovider ? Web3Subprovider['default'] : Web3Subprovider;
Wallet = 'default' in Wallet ? Wallet['default'] : Wallet;

/*
 * This module does bip39-like encoding of byte strings to words. It removes
 * the constraint from the original bip39 module to ensure that the encoded
 * bytes are 128 < x < 256 bits. We still want to use bip39 for encoding and
 * decoding actual keys, but when it comes to encoding the Shamir's Secret
 * Sharing shards we want a human-readable encoding that can exceed 256 bits
 * and may not be divisible by 4.
 */

var INVALID_ENTROPY = 'Invalid entropy';
var INVALID_MNEMONIC = 'Invalid mnemonic';
var INVALID_CHECKSUM = 'Invalid mnemonic checksum';

function bytesToBinary(bytes) {
  return bytes.map(function (x) {
    return lpad(x.toString(2), '0', 8);
  }).join('');
}

function binaryToByte(bin) {
  return parseInt(bin, 2);
}

function lpad(str, padString, length) {
  while (str.length < length) {
    str = padString + str;
  }return str;
}

function deriveChecksumBits(entropyBuffer) {
  var ENT = entropyBuffer.length * 8;
  var CS = ENT / 32;
  var hash = createHash('sha256').update(entropyBuffer).digest();

  return bytesToBinary([].slice.call(hash)).slice(0, CS);
}

function entropyToMnemonic(entropy, wordlist) {
  if (!Buffer.isBuffer(entropy)) entropy = Buffer.from(entropy, 'hex');
  wordlist = wordlist || bip39.wordlists.EN;

  if (entropy.length % 4 !== 0) throw new TypeError(INVALID_ENTROPY);

  var entropyBits = bytesToBinary([].slice.call(entropy));
  var checksumBits = deriveChecksumBits(entropy);

  var bits = entropyBits + checksumBits;
  var chunks = bits.match(/(.{1,11})/g);
  var words = chunks.map(function (binary) {
    var index = binaryToByte(binary);
    return wordlist[index];
  });

  return wordlist === bip39.wordlists.JA ? words.join('\u3000') : words.join(' ');
}

function mnemonicToEntropy(mnemonic, wordlist) {
  wordlist = wordlist || bip39.wordlists.EN;

  var words = unorm.nfkd(mnemonic).split(' ');
  // if (words.length % 3 !== 0) throw new Error(INVALID_MNEMONIC)

  // convert word indices to 11 bit binary strings
  var bits = words.map(function (word) {
    var index = wordlist.indexOf(word);
    if (index === -1) throw new Error(INVALID_MNEMONIC);

    return lpad(index.toString(2), '0', 11);
  }).join('');

  // split the binary string into ENT/CS
  var dividerIndex = Math.floor(bits.length / 33) * 32;
  var entropyBits = bits.slice(0, dividerIndex);
  var checksumBits = bits.slice(dividerIndex);

  // calculate the checksum and compare
  var entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);

  var entropy = Buffer.from(entropyBytes);
  var newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) throw new Error(INVALID_CHECKSUM);

  return entropy.toString('hex');
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiEndpoint = function () {
  function ApiEndpoint(apiServer) {
    _classCallCheck(this, ApiEndpoint);

    this.apiServer = apiServer;
  }

  _createClass(ApiEndpoint, [{
    key: 'upload',
    value: function upload(body) {
      return rp({
        method: 'POST',
        uri: this.apiServer,
        body: body,
        json: true
      });
    }
  }, {
    key: 'download',
    value: function download(shardid) {
      return rp({
        method: 'GET',
        uri: this.apiServer + '?id=' + shardid,
        json: true
      });
    }
  }]);

  return ApiEndpoint;
}();

var passwordStore = {};

var KeySplit = function () {
  function KeySplit() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, KeySplit);

    if (typeof window === "undefined") {
      var window = {};
    }
    this.apiUrl = options.apiUrl || "https://cgr6zthug7.execute-api.us-east-2.amazonaws.com/keysplit";
    this.localStorage = options.localStorage || window.localStorage;
    this.account = options.account;
    passwordStore[this] = options.password;
  }

  _createClass(KeySplit, [{
    key: 'mnemonicToSSS',
    value: function mnemonicToSSS(mnemonic, shareCount, threshold, password) {
      password = password || passwordStore[this];
      var key = bip39.mnemonicToEntropy(mnemonic);
      var salt = crypto.randomBytes(8);
      return new Promise(function (resolve, reject) {
        return crypto.pbkdf2(password, salt, 100000, 16, 'sha512', function (err, pbkdf2Pass) {
          if (err) {
            reject(err);
          }
          var c = crypto.createCipher("aes128", pbkdf2Pass);
          var encKey = c.update(key, 'hex', 'hex');
          encKey += c.final('hex');
          var splitVal = salt.toString("hex") + encKey;
          var shares = secrets.share(splitVal, shareCount, threshold);
          var mnemonicShares = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = shares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var share = _step.value;

              mnemonicShares.push(entropyToMnemonic(share + "000"));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          resolve(mnemonicShares);
        });
      });
    }
  }, {
    key: 'combineSSS',
    value: function combineSSS(mnemonicShares, password) {
      password = password || passwordStore[this];
      var shares = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = mnemonicShares[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var share = _step2.value;

          var shareHex = mnemonicToEntropy(share);
          shares.push(shareHex.slice(0, shareHex.length - 3));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var splitVal = secrets.combine(shares);
      var salt = new Buffer(splitVal.slice(0, 16), "hex");
      var encKey = splitVal.slice(16);
      return new Promise(function (resolve, reject) {
        return crypto.pbkdf2(password, salt, 100000, 16, 'sha512', function (err, pbkdf2Pass) {
          if (err) {
            reject(err);
          }
          var d = crypto.createDecipher("aes128", pbkdf2Pass);
          var rawKey = d.update(encKey, "hex", "hex");
          rawKey += d.final("hex");
          return bip39.entropyToMnemonic(rawKey);
        });
      });
    }
  }, {
    key: 'uploadShard',
    value: function uploadShard(shard, uploader) {
      uploader = uploader || new ApiEndpoint(this.apiUrl);
      var hash = crypto.createHash('sha256');
      var shardHex = mnemonicToEntropy(shard);
      hash.update(shardHex, "hex");
      var result = {
        shardid: hash.digest(),
        key: crypto.randomBytes(32)
      };
      var c = crypto.createCipher("aes256", result.key);
      var encShard = c.update(shardHex, "hex", "base64");
      encShard += c.final("base64");
      if (this.localStorage) {
        var shardList = JSON.parse(this.localStorage.getItem(this.account + ':shards'));
        if (shardList.indexOf(result.shardid.toString("hex")) < 0) {
          shardList.push(result.shardid.toString("hex"));
        }
        this.localStorage.setItem(this.account + ':shards', JSON.stringify(shardList));
      }
      return uploader.upload({ shardid: result.shardid, data: encShard }).then(function (response) {
        result.objectid = response;
        return result;
      });
    }
  }, {
    key: 'downloadShard',
    value: function downloadShard(pathAndKey, downloader) {
      downloader = downloader || new ApiEndpoint(this.apiUrl);
      var objectid, key;

      var _pathAndKey$split = pathAndKey.split(":");

      var _pathAndKey$split2 = _slicedToArray(_pathAndKey$split, 2);

      objectid = _pathAndKey$split2[0];
      key = _pathAndKey$split2[1];

      console.log(pathAndKey);
      return downloader.download(objectid).then(function (response) {
        console.log(objectid, key);
        var d = crypto.createDecipher("aes256", new Buffer(key, "base64"));
        var shardHex = d.update(response.data, "base64", "hex");
        shardHex += d.final("hex");
        console.log(entropyToMnemonic(shardHex));
        return entropyToMnemonic(shardHex);
      });
    }
  }, {
    key: 'saveShard',
    value: function saveShard(shard, password) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        password = password || passwordStore[_this];
        var salt = crypto.randomBytes(8);
        crypto.pbkdf2(password, salt, 100000, 16, 'sha512', function (err, pbkdf2Pass) {
          if (err) {
            reject(err);return;
          }
          var c = crypto.createCipher("aes128", pbkdf2Pass);
          var shardHex = mnemonicToEntropy(shard);
          var encShard = c.update(shardHex, 'hex', 'hex');
          encShard += c.final('hex');
          var splitVal = salt.toString("hex") + encShard;
          var hash = crypto.createHash('sha256');
          hash.update(shardHex, "hex");
          var shardId = hash.digest("hex");
          _this.localStorage.setItem('encShard:' + shardId, splitVal);
          var shardList = JSON.parse(_this.localStorage.getItem(_this.account + ':heldShards'));
          if (!shardList) {
            shardList = [];
          }
          if (shardList.indexOf(shardId) < 0) {
            shardList.push(shardId);
          }
          _this.localStorage.setItem(_this.account + ':heldShards', JSON.stringify(shardList));
          resolve(shardId);
        });
      });
    }
  }, {
    key: 'getShard',
    value: function getShard(shardId, password) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var splitVal = _this2.localStorage.getItem('encShard:' + shardId);
        var salt = new Buffer(splitVal.slice(0, 16), "hex");
        var encShard = splitVal.slice(16);
        crypto.pbkdf2(password, salt, 100000, 16, 'sha512', function (err, pbkdf2Pass) {
          if (err) {
            reject(err);
          }
          var d = crypto.createDecipher("aes128", pbkdf2Pass);
          var rawShard = d.update(encShard, "hex", "hex");
          rawShard += d.final("hex");
          resolve(bip39.entropyToMnemonic(rawShard));
        });
      });
    }
  }]);

  return KeySplit;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShardStore = {
  contractName: "ShardStore",
  abi: [{
    constant: false,
    inputs: [{
      name: "shardId",
      type: "uint256[]"
    }],
    name: "confirmStorage",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }, {
    anonymous: false,
    inputs: [{
      indexed: false,
      name: "trustedContact",
      type: "address"
    }, {
      indexed: true,
      name: "shardId",
      type: "uint256"
    }],
    name: "StorageConfirmed",
    type: "event"
  }],
  bytecode: "0x6060604052341561000f57600080fd5b6101678061001e6000396000f300606060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806385133e0514610046575b600080fd5b341561005157600080fd5b61009e6004808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919050506100a0565b005b60008090505b81518110156101375781818151811015156100bd57fe5b906020019060200201517f038265b6201154bc86ad21e0d59b47de41d924dfa563cc5ee1faaefc047ad8ad33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a280806001019150506100a6565b50505600a165627a7a72305820d26607c68bab436e60d32f775af326da65eb084578da8832b6d9a8d9692b6e2f0029",
  deployedBytecode: "0x606060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806385133e0514610046575b600080fd5b341561005157600080fd5b61009e6004808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919050506100a0565b005b60008090505b81518110156101375781818151811015156100bd57fe5b906020019060200201517f038265b6201154bc86ad21e0d59b47de41d924dfa563cc5ee1faaefc047ad8ad33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a280806001019150506100a6565b50505600a165627a7a72305820d26607c68bab436e60d32f775af326da65eb084578da8832b6d9a8d9692b6e2f0029",
  sourceMap: "26:1197:0:-;;;;;;;;;;;;;;;;;",
  deployedSourceMap: "26:1197:0:-;;;;;;;;;;;;;;;;;;;;;;;;150:168;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;211:6;220:1;211:10;;207:105;227:7;:14;223:1;:18;207:105;;;290:7;298:1;290:10;;;;;;;;;;;;;;;;;;261:40;278:10;261:40;;;;;;;;;;;;;;;;;;;;;;243:3;;;;;;;207:105;;;150:168;;:::o",
  source: "pragma solidity ^0.4.18;\n\ncontract ShardStore {\n\n    event StorageConfirmed(\n        address trustedContact,\n        uint indexed shardId\n    );\n\n    function confirmStorage(uint[] shardId) public {\n        for(uint i = 0; i < shardId.length; i++){\n            StorageConfirmed(msg.sender, shardId[i]);\n        }\n    }\n\n    /* FUTURE WORK FOR EVALUATION\n    - Do we want to create a mapping of addresses that are allowed\n    to call confirmStorage? Right now a small attack vector exists\n    where a malicious actor could confirm storage of a particular\n    shardId even though the true user is not confirming that and may\n    no longer have the ID.\n    */\n    /*\n    - I think a better approach is for the client side to track which address\n    has previously confirmed an address and alert the user if a new address\n    claims the address. On the client side, the user can elect to trust or\n    distrust new adresses that are trying to confirm their shard ids - similar\n    to how the Signal messenger alerts users when their contacts safety numbers\n    change.\n\n    That said, I think being able to trust multiple addresses to confirm a\n    shard needs to be out of scope for the next 11 hours of the hackathon.\n    */\n}\n",
  sourcePath: "/Users/nickneuman/ethdenver/ETHDenver/keysplit-dapp/solidity/contracts/shardstore.sol",
  ast: {
    attributes: {
      absolutePath: "/Users/nickneuman/ethdenver/ETHDenver/keysplit-dapp/solidity/contracts/shardstore.sol",
      exportedSymbols: {
        ShardStore: [36]
      }
    },
    children: [{
      attributes: {
        literals: ["solidity", "^", "0.4", ".18"]
      },
      id: 1,
      name: "PragmaDirective",
      src: "0:24:0"
    }, {
      attributes: {
        baseContracts: [null],
        contractDependencies: [null],
        contractKind: "contract",
        documentation: null,
        fullyImplemented: true,
        linearizedBaseContracts: [36],
        name: "ShardStore",
        scope: 37
      },
      children: [{
        attributes: {
          canonicalName: "ShardStore.ShardHash",
          name: "StorageConfirmed",
          scope: 64,
          visibility: "public",
          anonymous: false
        },
        children: [{
          attributes: {
            constant: false,
            name: "shardId",
            scope: 63,
            stateVariable: false,
            storageLocation: "default",
            type: "uint256",
            value: null,
            visibility: "internal"
          },
          children: [{
            attributes: {
              name: "trustedContact",
              type: "address",
              constant: false,
              indexed: false,
              scope: 7,
              stateVariable: false,
              storageLocation: "default",
              value: null,
              visibility: "internal"
            },
            id: 3,
            name: "VariableDeclaration",
            src: "85:22:0",
            children: [{
              attributes: {
                name: "address",
                type: "address"
              },
              id: 2,
              name: "ElementaryTypeName",
              src: "85:7:0"
            }]
          }, {
            attributes: {
              constant: false,
              indexed: true,
              name: "shardId",
              scope: 7,
              stateVariable: false,
              storageLocation: "default",
              type: "uint256",
              value: null,
              visibility: "internal"
            },
            children: [{
              attributes: {
                name: "uint",
                type: "uint256"
              },
              id: 4,
              name: "ElementaryTypeName",
              src: "117:4:0"
            }],
            id: 5,
            name: "VariableDeclaration",
            src: "117:20:0"
          }],
          id: 6,
          name: "ParameterList",
          src: "75:68:0"
        }, {
          attributes: {
            constant: false,
            name: "trustedContact",
            scope: 63,
            stateVariable: false,
            storageLocation: "default",
            type: "address",
            value: null,
            visibility: "internal"
          },
          children: [{
            attributes: {
              name: "address",
              type: "address"
            },
            id: 61,
            name: "ElementaryTypeName",
            src: "101:7:1"
          }],
          id: 62,
          name: "VariableDeclaration",
          src: "101:22:1"
        }],
        id: 7,
        name: "EventDefinition",
        src: "53:91:0"
      }, {
        attributes: {
          constant: false,
          implemented: true,
          isConstructor: false,
          modifiers: [null],
          name: "confirmStorage",
          payable: false,
          scope: 36,
          stateMutability: "nonpayable",
          superFunction: null,
          visibility: "public"
        },
        children: [{
          children: [{
            attributes: {
              constant: false,
              name: "shardId",
              scope: 35,
              stateVariable: false,
              storageLocation: "default",
              type: "uint256[] memory",
              value: null,
              visibility: "internal"
            },
            children: [{
              attributes: {
                name: "uint",
                type: "uint256[] storage pointer",
                length: null
              },
              id: 9,
              name: "ArrayTypeName",
              src: "174:6:0",
              children: [{
                attributes: {
                  name: "uint",
                  type: "uint256"
                },
                id: 8,
                name: "ElementaryTypeName",
                src: "174:4:0"
              }]
            }],
            id: 10,
            name: "VariableDeclaration",
            src: "174:14:0"
          }],
          id: 11,
          name: "ParameterList",
          src: "173:16:0"
        }, {
          attributes: {
            parameters: [null]
          },
          children: [],
          id: 12,
          name: "ParameterList",
          src: "197:0:0"
        }, {
          children: [{
            children: [{
              attributes: {
                argumentTypes: null,
                isConstant: false,
                isLValue: false,
                isPure: false,
                isStructConstructorCall: false,
                lValueRequested: false,
                names: [null],
                type: "tuple()",
                type_conversion: false,
                assignments: [14]
              },
              children: [{
                attributes: {
                  argumentTypes: [{
                    typeIdentifier: "t_address",
                    typeString: "address"
                  }, {
                    typeIdentifier: "t_uint256",
                    typeString: "uint256"
                  }],
                  overloadedDeclarations: [null],
                  referencedDeclaration: 7,
                  type: "uint256",
                  value: null,
                  constant: false,
                  name: "i",
                  scope: 35,
                  stateVariable: false,
                  storageLocation: "default",
                  visibility: "internal"
                },
                id: 14,
                name: "VariableDeclaration",
                src: "211:6:0",
                children: [{
                  attributes: {
                    name: "uint",
                    type: "uint256"
                  },
                  id: 13,
                  name: "ElementaryTypeName",
                  src: "211:4:0"
                }]
              }, {
                attributes: {
                  argumentTypes: null,
                  isConstant: false,
                  isLValue: false,
                  isPure: true,
                  lValueRequested: false,
                  member_name: "sender",
                  referencedDeclaration: null,
                  type: "int_const 0",
                  hexvalue: "30",
                  subdenomination: null,
                  token: "number",
                  value: "0"
                },
                children: [{
                  attributes: {
                    argumentTypes: null,
                    overloadedDeclarations: [null],
                    referencedDeclaration: 32,
                    type: "msg",
                    value: "msg"
                  },
                  id: 13,
                  name: "Identifier",
                  src: "222:3:0"
                }],
                id: 15,
                name: "Literal",
                src: "220:1:0"
              }, {
                attributes: {
                  argumentTypes: null,
                  overloadedDeclarations: [null],
                  referencedDeclaration: 9,
                  type: "uint256",
                  value: "shardId"
                },
                id: 15,
                name: "Identifier",
                src: "234:7:0"
              }],
              id: 16,
              name: "VariableDeclarationStatement",
              src: "211:10:0"
            }, {
              attributes: {
                argumentTypes: null,
                commonType: {
                  typeIdentifier: "t_uint256",
                  typeString: "uint256"
                },
                isConstant: false,
                isLValue: false,
                isPure: false,
                lValueRequested: false,
                operator: "<",
                type: "bool"
              },
              children: [{
                attributes: {
                  argumentTypes: null,
                  overloadedDeclarations: [null],
                  referencedDeclaration: 14,
                  type: "uint256",
                  value: "i"
                },
                id: 17,
                name: "Identifier",
                src: "223:1:0"
              }, {
                attributes: {
                  argumentTypes: null,
                  isConstant: false,
                  isLValue: false,
                  isPure: false,
                  lValueRequested: false,
                  member_name: "length",
                  referencedDeclaration: null,
                  type: "uint256"
                },
                children: [{
                  attributes: {
                    argumentTypes: null,
                    overloadedDeclarations: [null],
                    referencedDeclaration: 10,
                    type: "uint256[] memory",
                    value: "shardId"
                  },
                  id: 18,
                  name: "Identifier",
                  src: "227:7:0"
                }],
                id: 19,
                name: "MemberAccess",
                src: "227:14:0"
              }],
              id: 20,
              name: "BinaryOperation",
              src: "223:18:0"
            }, {
              children: [{
                attributes: {
                  argumentTypes: null,
                  isConstant: false,
                  isLValue: false,
                  isPure: false,
                  lValueRequested: false,
                  operator: "++",
                  prefix: false,
                  type: "uint256"
                },
                children: [{
                  attributes: {
                    argumentTypes: null,
                    overloadedDeclarations: [null],
                    referencedDeclaration: 14,
                    type: "uint256",
                    value: "i"
                  },
                  id: 21,
                  name: "Identifier",
                  src: "243:1:0"
                }],
                id: 22,
                name: "UnaryOperation",
                src: "243:3:0"
              }],
              id: 23,
              name: "ExpressionStatement",
              src: "243:3:0"
            }, {
              children: [{
                children: [{
                  attributes: {
                    argumentTypes: null,
                    isConstant: false,
                    isLValue: false,
                    isPure: false,
                    isStructConstructorCall: false,
                    lValueRequested: false,
                    names: [null],
                    type: "tuple()",
                    type_conversion: false
                  },
                  children: [{
                    attributes: {
                      argumentTypes: [{
                        typeIdentifier: "t_address",
                        typeString: "address"
                      }, {
                        typeIdentifier: "t_uint256",
                        typeString: "uint256"
                      }],
                      overloadedDeclarations: [null],
                      referencedDeclaration: 7,
                      type: "function (address,uint256)",
                      value: "StorageConfirmed"
                    },
                    id: 24,
                    name: "Identifier",
                    src: "261:16:0"
                  }, {
                    attributes: {
                      argumentTypes: null,
                      isConstant: false,
                      isLValue: false,
                      isPure: false,
                      lValueRequested: false,
                      member_name: "sender",
                      referencedDeclaration: null,
                      type: "address"
                    },
                    children: [{
                      attributes: {
                        argumentTypes: null,
                        overloadedDeclarations: [null],
                        referencedDeclaration: 48,
                        type: "msg",
                        value: "msg"
                      },
                      id: 25,
                      name: "Identifier",
                      src: "278:3:0"
                    }],
                    id: 26,
                    name: "MemberAccess",
                    src: "278:10:0"
                  }, {
                    attributes: {
                      argumentTypes: null,
                      isConstant: false,
                      isLValue: true,
                      isPure: false,
                      lValueRequested: false,
                      type: "uint256"
                    },
                    children: [{
                      attributes: {
                        argumentTypes: null,
                        overloadedDeclarations: [null],
                        referencedDeclaration: 10,
                        type: "uint256[] memory",
                        value: "shardId"
                      },
                      id: 27,
                      name: "Identifier",
                      src: "290:7:0"
                    }, {
                      attributes: {
                        argumentTypes: null,
                        overloadedDeclarations: [null],
                        referencedDeclaration: 14,
                        type: "uint256",
                        value: "i"
                      },
                      id: 28,
                      name: "Identifier",
                      src: "298:1:0"
                    }],
                    id: 29,
                    name: "IndexAccess",
                    src: "290:10:0"
                  }],
                  id: 30,
                  name: "FunctionCall",
                  src: "261:40:0"
                }],
                id: 31,
                name: "ExpressionStatement",
                src: "261:40:0"
              }],
              id: 32,
              name: "Block",
              src: "247:65:0"
            }],
            id: 33,
            name: "ForStatement",
            src: "207:105:0"
          }],
          id: 34,
          name: "Block",
          src: "197:121:0"
        }],
        id: 35,
        name: "FunctionDefinition",
        src: "150:168:0"
      }],
      id: 36,
      name: "ContractDefinition",
      src: "26:1197:0"
    }],
    id: 37,
    name: "SourceUnit",
    src: "0:1224:0"
  },
  compiler: {
    name: "solc",
    version: "0.4.18+commit.9cf6e910.Emscripten.clang"
  },
  networks: {},
  schemaVersion: "1.0.1",
  updatedAt: "2018-02-18T05:52:33.806Z"
};


var KeySplitContractInterface = function () {
  function KeySplitContractInterface() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck$1(this, KeySplitContractInterface);

    this.web3 = options.web3;
    this.contract = this.web3.eth.contract(ShardStore.abi).at(options.at || "0x8cdaf0cd259887258bc13a92c0a6da92698644c0");
    this.localStorage = options.localStorage;
    if (this.localStorage) {
      this.web3.eth.getAccounts(function (err, accounts) {
        _this.account = accounts[0];
        var shardList = JSON.parse(_this.localStorage.getItem(accounts[0] + ":shards"));
        if (!shardList) {
          shardList = [];
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = shardList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var shard = _step.value;

            getStorageConfirmed(shard);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
    }
  }

  _createClass$1(KeySplitContractInterface, [{
    key: "stop",
    value: function stop() {
      if (this.engine) {
        this.engine.stop();
      }
    }
  }, {
    key: "deploy",
    value: function deploy() {
      var _this2 = this;

      this.web3.eth.getAccounts(function (err, accounts) {
        if (err) {
          console.log(err);
          return;
        }
        var defaultAccount = accounts[0];
        _this2.web3.eth.contract(ShardStore.abi).new({ data: ShardStore.bytecode, gas: 1000000, from: defaultAccount }, function (err, data) {
          console.log(data);
        });
      });
    }
  }, {
    key: "confirmStorage",
    value: function confirmStorage(shardIds) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.web3.eth.getAccounts(function (err, accounts) {
          if (err) {
            reject(err);return;
          }
          var defaultAccount = accounts[0];
          var shardNumbers = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = shardIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var shardId = _step2.value;

              shardNumbers.push(new BigNumber(shardId, 16));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          console.log(shardNumbers);
          _this3.contract.confirmStorage.estimateGas(shardNumbers, { from: defaultAccount }, function (err, gas) {
            _this3.contract.confirmStorage(shardNumbers, { from: defaultAccount, gas: gas }, function (err, tx) {
              if (err) {
                reject(err);
                return;
              }
              resolve(tx);
            });
          });
        });
      });
    }
  }, {
    key: "watchStorageConfirmed",
    value: function watchStorageConfirmed(shardId) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var watcher = _this4.contract.StorageConfirmed({ fromBlock: "latest", shardId: new BigNumber(shardId, 16) });
        watcher.watch(function (err, evt) {
          if (err) {
            watcher.stopWatching(function () {});
            reject(err);
          }
          watcher.stopWatching(function () {});
          if (_this4.localStorage) {
            _this4.localStorage.setItem("shard:" + shardId, JSON.stringify({ block: evt.blockNumber, trustedContact: evt.args.trustedContact }));
          }
          resolve({ block: evt.blockNumber, trustedContact: evt.args.trustedContact });
        });
      });
    }
  }, {
    key: "getStorageConfirmed",
    value: function getStorageConfirmed(shardId) {
      var _this5 = this;

      if (this.localStorage) {
        var shardData = JSON.parse(this.localStorage.getItem("shard:" + shardId));
      } else {
        var shardData = { block: 0 };
      }
      return new Promise(function (resolve, reject) {
        var watcher = _this5.contract.StorageConfirmed({ fromBlock: shardData.block, shardId: new BigNumber(shardId, 16) });
        watcher.get(function (err, evts) {
          if (err) {
            reject(err);
          }
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = evts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var evt = _step3.value;

              if (evt.blockNumber > shardData.block) {
                if (_this5.localStorage) {
                  _this5.localStorage.setItem("shard:" + shardId, JSON.stringify({ block: evt.blockNumber, trustedContact: evt.args.trustedContact }));
                }
                resolve({ block: evt.blockNumber, trustedContact: evt.args.trustedContact });
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        });
      });
    }
  }, {
    key: "getShardStatus",
    value: function getShardStatus() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        if (!_this6.localStorage) {
          resolve([]);
        }
        _this6.web3.eth.getAccounts(function (err, accounts) {
          var shardJSON = _this6.localStorage.getItem(accounts[0] + ":shards");
          if (!shardJSON) {
            reject("No shards yet");
          }
          var shardIds = JSON.parse(shardJSON);
          var shards = [];
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = shardIds[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var shardId = _step4.value;

              var shard = JSON.parse(_this6.localStorage.getItem("shard:" + shardId));
              shard.update = _this6.watchStorageConfirmed(shardId);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          resolve(shards);
        });
      });
    }
  }, {
    key: "getHeldShards",
    value: function getHeldShards() {
      return JSON.parse(this.localStorage.getItem(this.account + ":heldShards"));
    }
  }, {
    key: "confirmStoredShards",
    value: function confirmStoredShards() {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        if (!_this7.localStorage) {
          resolve([]);
        }
        var heldShards = JSON.parse(_this7.localStorage.getItem(_this7.account + ":heldShards"));
        var currentShards = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = heldShards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var shardId = _step5.value;

            if (_this7.localStorage.getItem("encShard:" + shardId)) {
              currentShards.push(shardId);
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        resolve(_this7.confirmStorage(currentShards));
      });
    }
  }]);

  return KeySplitContractInterface;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordManagement = function () {
  function PasswordManagement(localStorage) {
    _classCallCheck$3(this, PasswordManagement);

    this.localStorage = localStorage;
  }

  _createClass$3(PasswordManagement, [{
    key: 'hashPass',
    value: function hashPass(password) {
      var salt = crypto.randomBytes(8);
      return new Promise(function (resolve, reject) {
        crypto.pbkdf2(password, salt, 100000, 16, 'sha256', function (err, pbkdf2Pass) {
          if (err) {
            reject(err);
          }
          resolve({ hash: pbkdf2Pass.toString("hex"), salt: salt.toString("hex") });
        });
      });
    }
  }, {
    key: 'checkPass',
    value: function checkPass(password, hash, salt) {
      return new Promise(function (resolve, reject) {
        crypto.pbkdf2(password, new Buffer(salt, "hex"), 100000, 16, 'sha256', function (err, pbkdf2Pass) {
          if (err) {
            reject(err);
          }
          resolve(pbkdf2Pass.equals(new Buffer(hash, "hex")));
        });
      });
    }
  }, {
    key: 'storePass',
    value: function storePass(password, account) {
      var _this = this;

      return this.hashPass(password).then(function (result) {
        _this.localStorage.setItem(account + ':password', JSON.stringify(result));
      });
    }
  }, {
    key: 'checkAccountPass',
    value: function checkAccountPass(password, account) {
      var pdata = JSON.parse(this.localStorage.getItem(account + ':password'));
      if (pdata) {
        return this.checkPass(password, pdata.hash, pdata.salt);
      } else {
        return Promise.resolve(false);
      }
    }
  }, {
    key: 'hasAccountPass',
    value: function hasAccountPass(account) {
      return !!this.localStorage.getItem(account + ':password');
    }
  }]);

  return PasswordManagement;
}();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  /*
   * Construct with {}
   */
  function App() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck$2(this, App);

    var rpcURL = options.rpcURL || "https://ropsten.infura.io/atjfYkLXBNdLI0zSm9eE";
    if (typeof window === 'undefined') {
      var window = {};
    }
    this.localStorage = options.localStorage || window.localStorage;
    if (options.currentProvider) {
      this.web3 = new Web3(options.currentProvider);
    } else if (window && window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      var privateKey = options.privateKey || localStorage.getItem("localPrivateKey");
      if (!privateKey) {
        privateKey = Wallet.generate().getPrivateKeyString().slice(2);
        if (localStorage) {
          localStorage.setItem("localPrivateKey", privateKey);
        }
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
        eth_syncing: true
      }));

      // filters
      this.engine.addProvider(new FilterSubprovider());

      // id mgmt
      this.engine.addProvider(new WalletSubprovider(wallet, {}));

      this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(rpcURL)));

      this.engine.on('block', function (block) {
        console.log('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'));
      });

      // network connectivity error
      this.engine.on('error', function (err) {
        // report connectivity errors
        console.error(err.stack);
      });

      // start polling for blocks
      this.engine.start();
    }
    this.PasswordManagement = new PasswordManagement(this.localStorage);
    this.ContractInterface = new KeySplitContractInterface({ web3: this.web3, at: options.at, localStorage: this.localStorage });
    this.KeySplitPromise = new Promise(function (resolve, reject) {
      _this.ksResolve = resolve;
      _this.ksReject = reject;
    });

    this.account = new Promise(function (resolve, reject) {
      _this.web3.eth.getAccounts(function (err, accounts) {
        if (err) {
          reject(err);
        }
        resolve(accounts[0]);
      });
    });
  }

  _createClass$2(App, [{
    key: 'hasAccount',
    value: function hasAccount() {
      var _this2 = this;

      return this.account.then(function (account) {
        return _this2.PasswordManagement.hasAccountPass(account);
      });
    }
  }, {
    key: 'signUp',
    value: function signUp(password) {
      var _this3 = this;

      return this.account.then(function (account) {
        _this3.ksResolve(new KeySplit({ account: account, password: password, localStorage: _this3.localStorage }));
        return _this3.PasswordManagement.storePass(password, account);
      });
    }
  }, {
    key: 'signIn',
    value: function signIn(password) {
      var _this4 = this;

      return this.account.then(function (account) {
        var result = _this4.PasswordManagement.checkAccountPass(password, account);
        result.then(function () {
          _this4.ksResolve(new KeySplit({ account: account, password: password, localStorage: _this4.localStorage }));
        });
        return result;
      });
    }
  }, {
    key: 'confirmFromUrlHash',
    value: function confirmFromUrlHash() {
      var _this5 = this;

      var hash = window.location.hash.slice(1);
      if (!hash) {
        reject("No shard in url");
      }
      return this.KeySplitPromise.then(function (KeySplit$$1) {
        return KeySplit$$1.downloadShard(hash).then(function (shardMnemonic) {
          console.log("got here mnemonic");
          return KeySplit$$1.saveShard(shardMnemonic);
        });
      }).then(function (shardId) {
        console.log("got here");
        return _this5.ContractInterface.confirmStoredShards();
      });
    }
  }, {
    key: 'splitSeedAndUpload',
    value: function splitSeedAndUpload(seed) {
      return this.KeySplitPromise.then(function (KeySplit$$1) {
        return KeySplit$$1.mnemonicToSSS(seed, 5, 3).then(function (mnemonicShards) {
          var shards = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = mnemonicShards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var shard = _step.value;

              shards.push(KeySplit$$1.uploadShard(shard));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return Promise.all(shards);
        });
      }).then(function (results) {
        var urls = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var result = _step2.value;

            urls.push('' + window.location.origin + window.location.pathname + '#' + result.objectid.objectid + ':' + result.key.toString("base64"));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return urls;
      });
    }
  }, {
    key: 'distributedShardData',
    value: function distributedShardData() {
      return this.ContractInterface.getShardStatus();
    }
  }, {
    key: 'heldShardData',
    value: function heldShardData() {
      return getHeldShards();
    }
  }, {
    key: 'getShardMnemonic',
    value: function getShardMnemonic(shardId) {
      return this.ContractInterface.getShard(shardId);
    }
  }, {
    key: 'currentBlock',
    value: function currentBlock() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.web3.getBlockNumber(function (err, blocknum) {
          if (err) {
            reject(err);
          }
          resolve(blocknum);
        });
      });
    }
  }]);

  return App;
}();

exports.KeySplit = KeySplit;
exports.KeySplitContractInterface = KeySplitContractInterface;
exports.App = App;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
