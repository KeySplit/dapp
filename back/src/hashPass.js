import crypto from 'crypto';

export class PasswordManagement {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }
  hashPass(password) {
    var salt = crypto.randomBytes(8);
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 16, 'sha256', (err, pbkdf2Pass) => {
        if(err) { reject(err) }
        resolve({hash: pbkdf2Pass.toString("hex"), salt: salt.toString("hex")});
      });
    });
  }
  checkPass(password, hash, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, new Buffer(salt, "hex"), 100000, 16, 'sha256', (err, pbkdf2Pass) => {
        if(err) { reject(err) }
        resolve(pbkdf2Pass.equals(new Buffer(hash, "hex")));
      });
    })
  }
  storePass(password, account) {
    return this.hashPass(password).then((result) => {
      this.localStorage.setItem(`${account}:password`, JSON.stringify(result));
    })
  }
  checkAccountPass(password, account) {
    var pdata = JSON.parse(this.localStorage.getItem(`${account}:password`));
    if(pdata) {
      return this.checkPass(password, pdata.hash, pdata.salt);
    } else {
      return Promise.resolve(false);
    }
  }
  hasAccountPass(account) {
    return !!this.localStorage.getItem(`${account}:password`);
  }
}
