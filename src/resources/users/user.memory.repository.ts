import { getConnection } from "typeorm";
import { hash, compare } from 'bcrypt';
import { User } from './user.model';
import { unassignUser as taskUnassignUser } from '../tasks/task.memory.repository';
import { HASH_ROUNDS } from "../../common/config";

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
  return hash(password, HASH_ROUNDS).then(async (hashVal: string) => {
    const newUser = getConnection().getRepository(User).create();
    newUser.name = name;
    newUser.login = login;
    newUser.password = hashVal;

    return getConnection().getRepository(User).save(newUser);
  });
}

export const loginUser = async (login: string, password: string): Promise<User | undefined> => {
  const user = await getConnection().getRepository(User)
      .createQueryBuilder('user')
      .where('"user"."login" = :login', {login})
      .addSelect(['user.password'])
      .getOne();

  if (!user) {
    return;
  }

  return compare(password, user.password).then(result => result ? user : undefined);
}

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

