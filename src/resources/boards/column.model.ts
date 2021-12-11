import { v4 as uuid_v4 } from 'uuid';

export type ColumnId = string;


interface IColumnKey {
  [key: string]: string | number | undefined
}


export type ColumnType = {
  id?: ColumnId;
  title: string;
  order: number;
};

export type ColumnArgType = Partial<ColumnType>;

export class Column implements ColumnType {
  id: ColumnId;

  title: string;

  order: number;

  constructor({
    id = uuid_v4(),
    title = '',
    order = 0
  }) {
    this.id = id;
    this.title = title;
    this.order = order;
  }
}

