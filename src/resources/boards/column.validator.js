const uuid = require('uuid');

const columnValidators = {
  title: x => typeof x === 'string' && x.trim(),
  order: x => typeof x === 'number',
}

const validateColumns = async (columns) => {
  if (!Array.isArray(columns)) {
    return null;
  }
  const validated = [];
  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];
    const colOk = {};
    for (let e = 0; e < Object.entries(columnValidators).length; e += 1) {
      const [name, validator] = Object.entries(columnValidators)[e];
      if (column[name] !== undefined) {
        if (!validator(column[name])) {
          return null;
        }
        colOk[name] = column[name];
      }
    }
    if (column.id !== undefined) {
      if (!uuid.validate(column.id)) {
        return null;
      }
      colOk.id = column.id;
    }
    validated.push(colOk);
  }
  return validated;
};


module.exports = {
  validateColumns,
  id: uuid.validate,
}
