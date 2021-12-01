const uuid = require('uuid');

class User {
  constructor({
    id = uuid.v4(),
    name = 'USER',
    login = 'user',
    password = 'P@55w0rd'
  } = {}) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  toResponse() {
    return {
      id: this.id,
      name: this.name,
      login: this.login
    }
  }
}

module.exports = User;
