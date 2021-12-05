const User = require('./user.model');
const { UserNotFoundError } = require('../../common/errors');

const users = [
  new User({
    id: 'dbf6daeb-543e-4d40-b95b-da5a04a7685d',
    name: "admin",
    login: "adminl",
    password: "123"
  }),
];

const getAll = async () =>
  // TODO: mock implementation. should be replaced during task development
   users
;

const getById = async (userId) => users.find(u => u.id === userId)

const create = async (name, login, password) => {
  const newUser = new User({name, login, password});
  users.push(newUser);
  return newUser
}

const loginUser = async (login, password) => users.find((u) => u.login === login && u.password === password)

const updateUser = async (userId, toUpdate) => {
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  Object.assign(user, toUpdate);
  return user;
}

const deleteUser = async (userId) => {
  // TODO set tasks userId = null
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx < 0) {
    throw new UserNotFoundError();
  }
  users.splice(userIdx, 1);
}

module.exports = {
  getAll,
  getById,
  create,
  loginUser,
  updateUser,
  deleteUser,
};
