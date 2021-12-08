import uuid from 'uuid';

type ColumnId = string;

type ColumnType = {
  id?: ColumnId;
  title: string;
  order: number;
};

export class Column implements ColumnType {
  id: ColumnId;

  title: string;

  order: number;

  constructor({
    id = uuid.v4(),
    title = '',
    order = 0
  }) {
    this.id = id;
    this.title = title;
    this.order = order;
  }
}

