import { getConnection } from "typeorm";
import { User } from './user.model';
import { unassignUser as taskUnassignUser } from '../tasks/task.memory.repository';

/*
const users = [
  new User({
    id: 'dbf6daeb-543e-4d40-b95b-da5a04a7685d',
    name: "admin",
    login: "adminl",
    password: "123"
  }),
];
*/

export const getAll = async (): Promise<User[]> =>
  getConnection().getRepository(User)
      .createQueryBuilder('user')
      .orderBy('user.id')
      .getMany();


export const getById = async (userId: string): Promise<User | undefined> =>
  getConnection().getRepository(User)
      .findOne(userId);

export const create = async (name: string, login: string, password: string): Promise<User> => {
  const newUser = getConnection().getRepository(User).create();
  newUser.name = name;
  newUser.login = login;
  newUser.password = password;

  return getConnection().getRepository(User).save(newUser);
}

export const loginUser = async (login: string, password: string): Promise<User | undefined> =>
  getConnection().getRepository(User)
      .createQueryBuilder('user')
      .where('user.login = :login AND user.password = :password', {login, password})
      .getOne();


interface UpdateArg {
  name: string,
  login: string,
  password: string
}

export const updateUser = async (userId: string, toUpdate: UpdateArg): Promise<User | undefined> => {
  const user = await getConnection().getRepository(User)
      .findOne(userId);
  if (!user) {
    return undefined;
  }

  user.name = toUpdate.name;
  // user.login = toUpdate // Login should not be updated
  user.password = toUpdate.password;

  return getConnection().getRepository(User).save(user);
}

export const deleteUser = async (userId: string): Promise<boolean | undefined> => {
  await taskUnassignUser(userId);

  const result = await getConnection().getRepository(User)
      .createQueryBuilder('user')
      .delete()
      .where('id = :userId', {userId})
      .execute();

  return result.affected! > 0;
}

