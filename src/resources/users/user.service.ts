import * as usersRepo from './user.memory.repository';
import * as taskService from '../tasks/task.service';

const getAll = () => usersRepo.getAll();
const getById = (userId: string) => usersRepo.getById(userId);
const create = (name: string, login: string, password: string) => usersRepo.create(name, login, password);
const loginUser = (login: string, password: string) => usersRepo.loginUser(login, password);

interface UpdateObj {

}


const updateUser = (userId: string, toUpdate: UpdateObj) => usersRepo.updateUser(userId, toUpdate);
const deleteUser = async (userId: string) => {
    await taskService.unassignUser(userId);
    return usersRepo.deleteUser(userId);
}

module.exports = {
    getAll,
    getById,
    create,
    loginUser,
    updateUser,
    deleteUser,
};
