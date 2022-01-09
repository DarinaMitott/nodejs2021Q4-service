import { v4 as uuidV4 } from 'uuid';

export type ColumnId = string;

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
    id = uuidV4(),
    title = '',
    order = 0
  }) {
    this.id = id;
    this.title = title;
    this.order = order;
  }
}

