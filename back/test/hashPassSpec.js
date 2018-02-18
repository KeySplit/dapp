import chai from 'chai';
import {PasswordManagement} from "../src/hashPass.js"

const expect = chai.expect;

export class MockLocalStorage {
  constructor() {
    this.storage = {}
  }
  setItem(key, value) {
    this.storage[key] = value
  }
  getItem(key) {
    return this.storage[key]
  }
}

describe("PasswordManagement", ()=> {
  describe("PasswordManagement.hashPass", () => {
    it("should hash a password", () => {
      return new PasswordManagement().hashPass("foo").then((result) => {
        expect(result).to.have.all.keys("hash", "salt");
        expect(result.salt).to.have.lengthOf(16);
        expect(result.hash).to.have.lengthOf(32);
      })
    }).timeout(10000)
  })
  describe("PasswordManagement.checkPass", () => {
    it("should check hashed a password", () => {
      var pm = new PasswordManagement();
      return pm.hashPass("foo").then((result) => {
        return pm.checkPass("foo", result.hash, result.salt).then((val) => {
          expect(val).to.be.equal(true)
        })
      })
    }).timeout(10000)
    it("should check hashed a password that is wrong", () => {
      var pm = new PasswordManagement();
      return pm.hashPass("foo").then((result) => {
        return pm.checkPass("bar", result.hash, result.salt).then((val) => {
          expect(val).to.be.equal(false)
        })
      })
    }).timeout(10000)
  })
  describe("PasswordManagement.storePass", () => {
    it("should store a password in localStorage", () => {
      var localStorage = new MockLocalStorage();
      var pm = new PasswordManagement(localStorage);
      return pm.storePass("foo", "abc").then(() => {
        var result = JSON.parse(localStorage.getItem("abc:password"));
        expect(result).to.have.all.keys("hash", "salt");
      })
    })
  })
  describe("PasswordManagement.chceckAccountPass", () => {
    it("should store a password in localStorage", () => {
      var localStorage = new MockLocalStorage();
      var pm = new PasswordManagement(localStorage);
      return pm.storePass("foo", "abc").then(() => {
        var result = JSON.parse(localStorage.getItem("abc:password"));
        return pm.checkAccountPass("foo", "abc").then((val) => {
          expect(val).to.be.equal(true);
        })
      })
    })
  })
})
