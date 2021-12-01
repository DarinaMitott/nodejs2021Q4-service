const User = require('./user.model');

const users = [];

const getAll = async () => 
  // TODO: mock implementation. should be replaced during task development
   users
;

const create = async (name, login, password) => {
  const newUser = new User({name, login, password});
  users.push(newUser);
  return newUser
}

module.exports = {
  getAll,
  create
};
