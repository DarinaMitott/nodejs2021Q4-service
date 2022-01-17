import { validate } from 'uuid';

export const idValidator = (x: string): boolean => validate(x);

export const userValidators = {
    name: (x?: string | number | unknown): boolean => typeof x === 'string' && x.trim().length > 0,
    login: (x?: string | number | unknown): boolean => typeof x === 'string' && x.trim().length > 0,
    password: (x?: string | number | unknown): boolean => typeof x === 'string' && x.trim().length > 0
};
