import { validate } from 'uuid';
import { ColumnArgType } from "./column.model";

type Validator = (x?: string|number|undefined) => boolean;

const columnValidators = {
  title: (x?: string | number): boolean => typeof x === 'string' && x.trim().length > 0,
  order: (x?: string | number): boolean => typeof x === 'number',
}

interface IColumnKey {
  [key: string]: string | number | undefined
}


// export interface ColumnArg extends IColumnKey {
//   id?: string,
//   title?: string,
//   order?: number
// }

export const idValidator = validate;

export const validateColumns = async (columns: ColumnArgType[]): Promise<ColumnArgType[] | null> => {
  if (!Array.isArray(columns)) {
    return null;
  }
  const validated = [];
  for (let i = 0; i < columns.length; i += 1) {
    const column: ColumnArgType = columns[i];
    const colOk: ColumnArgType = {};
    Object.entries(columnValidators).forEach(([name, validator]: [string, Validator]) => {
      const value = (column as IColumnKey)[name];
      if (value !== undefined) {
        if (!validator(value)) {
          return null;
        }
        (colOk as IColumnKey)[name] = value;
      }
    });

    if (column.id !== undefined) {
      if (!idValidator(column.id)) {
        return null;
      }
      colOk.id = column.id;
    }
    validated.push(colOk);
  }
  return validated;
};


