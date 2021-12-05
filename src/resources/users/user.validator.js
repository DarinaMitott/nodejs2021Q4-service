const uuid = require('uuid');

const idValidator = x => uuid.validate(x);

const userValidators = {
    name: x => typeof x === 'string' && x,
    login: x => typeof x === 'string' && x,
    password: x => typeof x === 'string' && x
};

module.exports = {
    id: idValidator,
    user: userValidators
};
