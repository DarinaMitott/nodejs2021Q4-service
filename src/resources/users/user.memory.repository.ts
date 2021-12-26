import { User } from './user.model';


const users = [
  new User({
    id: 'dbf6daeb-543e-4d40-b95b-da5a04a7685d',
    name: "admin",
    login: "adminl",
    password: "123"
  }),
];

export const getAll = async (): Promise<User[]> => users;

export const getById = async (userId: string): Promise<User | undefined> => users.find(u => u.id === userId)

export const create = async (name: string, login: string, password: string): Promise<User> => {
  const newUser = new User({name, login, password});
  users.push(newUser);
  return newUser
}

export const loginUser = async (login: string, password: string): Promise<User | undefined> => users.find((u) => u.login === login && u.password === password)

interface UpdateArg {
  name: string,
  login: string,
  password: string
}

export const updateUser = async (userId: string, toUpdate: UpdateArg): Promise<User | undefined> => {
  const user = users.find(u => u.id === userId);
  if (!user) {
    return undefined;
  }

  Object.assign(user, toUpdate);
  return user;
}

export const deleteUser = async (userId: string): Promise<boolean | undefined> => {
  // TODO set tasks userId = null
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx < 0) {
    return undefined;
  }
  users.splice(userIdx, 1);
  return true;
}

