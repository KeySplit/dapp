/*
 * This module does bip39-like encoding of byte strings to words. It removes
 * the constraint from the original bip39 module to ensure that the encoded
 * bytes are 128 < x < 256 bits. We still want to use bip39 for encoding and
 * decoding actual keys, but when it comes to encoding the Shamir's Secret
 * Sharing shards we want a human-readable encoding that can exceed 256 bits
 * and may not be divisible by 4.
 */

import bip39 from 'bip39';
import createHash from 'create-hash';
import unorm from 'unorm';

var INVALID_ENTROPY = 'Invalid entropy';
var INVALID_MNEMONIC = 'Invalid mnemonic';
var INVALID_CHECKSUM = 'Invalid mnemonic checksum';


function bytesToBinary (bytes) {
  return bytes.map(function (x) {
    return lpad(x.toString(2), '0', 8)
  }).join('')
}

function binaryToByte (bin) {
  return parseInt(bin, 2)
}

function lpad (str, padString, length) {
  while (str.length < length) str = padString + str
  return str
}


function deriveChecksumBits (entropyBuffer) {
  var ENT = entropyBuffer.length * 8
  var CS = ENT / 32
  var hash = createHash('sha256').update(entropyBuffer).digest()

  return bytesToBinary([].slice.call(hash)).slice(0, CS)
}

function salt (password) {
  return 'mnemonic' + (password || '')
}

export function entropyToMnemonic (entropy, wordlist) {
  if (!Buffer.isBuffer(entropy)) entropy = Buffer.from(entropy, 'hex')
  wordlist = wordlist || bip39.wordlists.EN;

  if (entropy.length % 4 !== 0) throw new TypeError(INVALID_ENTROPY);

  var entropyBits = bytesToBinary([].slice.call(entropy))
  var checksumBits = deriveChecksumBits(entropy)

  var bits = entropyBits + checksumBits
  var chunks = bits.match(/(.{1,11})/g)
  var words = chunks.map(function (binary) {
    var index = binaryToByte(binary)
    return wordlist[index]
  })

  return wordlist === bip39.wordlists.JA ? words.join('\u3000') : words.join(' ')
}

export function mnemonicToEntropy (mnemonic, wordlist) {
  wordlist = wordlist || bip39.wordlists.EN;

  var words = unorm.nfkd(mnemonic).split(' ')
  // if (words.length % 3 !== 0) throw new Error(INVALID_MNEMONIC)

  // convert word indices to 11 bit binary strings
  var bits = words.map(function (word) {
    var index = wordlist.indexOf(word)
    if (index === -1) throw new Error(INVALID_MNEMONIC)

    return lpad(index.toString(2), '0', 11)
  }).join('')

  // split the binary string into ENT/CS
  var dividerIndex = Math.floor(bits.length / 33) * 32
  var entropyBits = bits.slice(0, dividerIndex)
  var checksumBits = bits.slice(dividerIndex)

  // calculate the checksum and compare
  var entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte)

  var entropy = Buffer.from(entropyBytes)
  var newChecksum = deriveChecksumBits(entropy)
  if (newChecksum !== checksumBits) throw new Error(INVALID_CHECKSUM)

  return entropy.toString('hex')
}
