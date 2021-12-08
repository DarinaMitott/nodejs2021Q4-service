import { validate } from 'uuid';

const columnValidators = {
  title: (x?: string | number) => typeof x === 'string' && x.trim(),
  order: (x?: string | number) => typeof x === 'number',
}

interface IColumnKey {
  [key: string]: string | number | undefined
}

interface ColumnArg extends IColumnKey {
  id?: string,
  title?: string,
  order?: number
}

export const id = validate;

export const validateColumns = async (columns: ColumnArg[]): Promise<ColumnArg[] | null> => {
  if (!Array.isArray(columns)) {
    return null;
  }
  const validated = [];
  for (let i = 0; i < columns.length; i += 1) {
    const column: ColumnArg = columns[i];
    const colOk: ColumnArg = {};
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
      if (!id(column.id)) {
        return null;
      }
      colOk.id = column.id;
    }
    validated.push(colOk);
  }
  return validated;
};


