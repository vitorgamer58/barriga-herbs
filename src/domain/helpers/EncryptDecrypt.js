const bcrypt = require('bcrypt');

class EncryptDecrypt {
  static getPasswdHash(passwd) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passwd, salt);
  }

  static comparePasswords(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
  }
}

module.exports = { EncryptDecrypt };
