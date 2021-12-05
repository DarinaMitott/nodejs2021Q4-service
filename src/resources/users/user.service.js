const usersRepo = require('./user.memory.repository');

const getAll = () => usersRepo.getAll();
const getById = (userId) => usersRepo.getById(userId);
const create = (name, login, password) => usersRepo.create(name, login, password);
const loginUser = (login, password) => usersRepo.loginUser(login, password);

module.exports = {
    getAll,
    create,
    loginUser,
    getById,
};
