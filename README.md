# KeySplit

KeySplit helps users securely and safely recover their private keys and/or passwords. The app uses Shamir’s Secret Sharing algorithm to split and locally encrypt any string input into “shards” that can be shared with others for safe keeping.

KeySplit was conceived at the ETHDenver hackathon back in February 2018.

 - https://keysplit.io/
 - https://devpost.com/software/keysplit

Some blog posts describing the use case:
 - [KeySplit Private Key Security for Cryptocurrency Owners](https://medium.com/@nickneuman/keysplit-private-key-security-for-cryptocurrency-owners-d1653ea9631d?source=linkShare-b3e710024452-1530024188)
 - [Introducing KeySplit a simple recovery tool for your secret keys and passwords](https://medium.com/@barrassomark/introducing-keysplit-a-simple-recovery-tool-for-your-secret-keys-and-passwords-1e563b6e8ad4?source=linkShare-b3e710024452-1530024227)

# dApp
[KeySplit's](https://keysplit.io/) main decentralized application.

## Getting Started

NodeJS 8.11.2 LTS is recommended for compatibility.

```
$ git clone https://github.com/KeySplit/dapp.git
```

Install needed `npm` modules.
```
$ npm install
```

To run the `dApp` locally.

```
$ npm run start
```
