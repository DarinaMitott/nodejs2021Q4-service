import * as usersRepo from './user.memory.repository';

export const getAll = () => usersRepo.getAll();
export const getById = (userId: string) => usersRepo.getById(userId);
export const create = (name: string, login: string, password: string) => usersRepo.create(name, login, password);
export const loginUser = async (login: string, password: string) => usersRepo.loginUser(login, password);

export type UserUpdateArg = {
    name: string,
    login: string,
    password: string
}


export const updateUser = (userId: string, toUpdate: UserUpdateArg) => usersRepo.updateUser(userId, toUpdate);
export const deleteUser = async (userId: string) => usersRepo.deleteUser(userId)
