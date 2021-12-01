const usersRepo = require('./user.memory.repository');

const getAll = () => usersRepo.getAll();
const create = (name, login, password) => usersRepo.create(name, login, password);

module.exports = {
    getAll,
    create
};
