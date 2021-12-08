import uuid from 'uuid';

const idValidator = (x: string) => uuid.validate(x);

const userValidators = {
    name: (x?: string | number) => typeof x === 'string' && x,
    login: (x?: string | number) => typeof x === 'string' && x,
    password: (x?: string | number) => typeof x === 'string' && x
};

module.exports = {
    id: idValidator,
    user: userValidators
}
