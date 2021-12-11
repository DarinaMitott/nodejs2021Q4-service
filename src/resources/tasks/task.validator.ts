import {TaskCreateOrUpdateArg} from "./task.model";

const { validate } = require('uuid');

type UserInputType = string | number | null | undefined;
const VALIDATORS = {
  title: (x: UserInputType): boolean => typeof x === 'string' && x.trim().length > 0,
  order: (x: UserInputType): boolean => typeof x === 'number',
  description: (x: UserInputType): boolean => x === undefined || typeof x === 'string' && x.trim().length > 0,
  userId: (x: UserInputType): boolean => x === undefined || x === null || validate(x),
  boardId: (x: UserInputType): boolean => x === undefined || x === null || typeof x === 'string' && validate(x),
  columnId: (x: UserInputType): boolean => x === undefined || x === null || typeof x === 'string' && validate(x),
};

interface ITaskKey {
  [key: string]: string | number | null | undefined
}

export const validateTask = async (task: Partial<TaskCreateOrUpdateArg>): Promise<TaskCreateOrUpdateArg | null> => {
  const validated = {};
  for (let i = 0; i < Object.entries(VALIDATORS).length; i += 1) {
    const [name, validator] = Object.entries(VALIDATORS)[i];
    const value = task[name as keyof TaskCreateOrUpdateArg];
    if (!validator(value)) {
      return null;
    }
    (validated as ITaskKey)[name] = value;
  }
  return validated as TaskCreateOrUpdateArg;
}

