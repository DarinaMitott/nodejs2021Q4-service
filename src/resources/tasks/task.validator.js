const uuid = require('uuid');

const VALIDATORS = {
  title: x => typeof x === 'string' && x.trim(),
  order: x => typeof x === 'number',
  description: x => x === undefined || typeof x === 'string' && x.trim(),
  userId: x => x === undefined || x === null || uuid.validate(x),
  boardId: x => x === null || typeof x === 'string' && uuid.validate(x),
  columnId: x => x === null || typeof x === 'string' && uuid.validate(x),
};

const validate = async (task) => {
  const validated = {};
  for (let i = 0; i < Object.entries(VALIDATORS).length; i += 1) {
    const [name, validator] = Object.entries(VALIDATORS)[i];
    if (task[name] !== undefined) {
      if (!validator(task[name])) {
        return null;
      }
      validated[name] = task[name];
    }
  }
  return validated;
}

module.exports = {
  validate
}
