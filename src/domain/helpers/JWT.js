const jwt = require('jwt-simple');
require('dotenv').config();

class JWT {
  constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  generateJWT(user) {
    return jwt.encode(user, this.secret);
  }
}

module.exports = { JWT };
