import * as usersRepo from './user.memory.repository';
import * as taskService from '../tasks/task.service';

export const getAll = () => usersRepo.getAll();
export const getById = (userId: string) => usersRepo.getById(userId);
export const create = (name: string, login: string, password: string) => usersRepo.create(name, login, password);
export const loginUser = (login: string, password: string) => usersRepo.loginUser(login, password);

export type UserUpdateArg = {
    name: string,
    login: string,
    password: string
}


export const updateUser = (userId: string, toUpdate: UserUpdateArg) => usersRepo.updateUser(userId, toUpdate);
export const deleteUser = async (userId: string) => {
    await taskService.unassignUser(userId);
    return usersRepo.deleteUser(userId);
}
