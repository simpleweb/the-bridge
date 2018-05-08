const CryptoJS = require("crypto-js");
const key = 'the-bridge';

const hashHelper = class HashHelper {
  static GenerateHash(message) {
    return CryptoJS
      .HmacSHA256(message, key)
      .toString();
  }
  static Compare(user1, user2) {
    return user1 === this.GenerateHash(user2);
  }
}

module.exports = hashHelper;