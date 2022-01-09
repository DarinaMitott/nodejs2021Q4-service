import { v4 as uuidV4 } from 'uuid';

type UserType = {
  id: string;
  name: string;
  login: string;
  password: string
}

export class User implements UserType {
  id: string;

  name: string;

  login: string;

  password: string;

  constructor({
    id = uuidV4(),
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

