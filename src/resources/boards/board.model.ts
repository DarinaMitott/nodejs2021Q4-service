import { v4 as uuid_v4 } from 'uuid';
import { Column } from './column.model';


interface BoardType {
  id?: string;
  title: string;
  columns: Column[];
}

export class Board implements BoardType {
  id: string;

  title: string;

  columns: Column[];

  constructor({
    id = uuid_v4(),
    title = '',
    columns = []
  }: BoardType) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }
}

