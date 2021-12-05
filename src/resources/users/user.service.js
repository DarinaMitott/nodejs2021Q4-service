const usersRepo = require('./user.memory.repository');
const taskService = require('../tasks/task.service');

const getAll = () => usersRepo.getAll();
const getById = (userId) => usersRepo.getById(userId);
const create = (name, login, password) => usersRepo.create(name, login, password);
const loginUser = (login, password) => usersRepo.loginUser(login, password);
const updateUser = (userId, toUpdate) => usersRepo.updateUser(userId, toUpdate);
const deleteUser = async (userId) => taskService.unassignUser(userId)
        .then(usersRepo.deleteUser(userId));

module.exports = {
    getAll,
    getById,
    create,
    loginUser,
    updateUser,
    deleteUser,
};
