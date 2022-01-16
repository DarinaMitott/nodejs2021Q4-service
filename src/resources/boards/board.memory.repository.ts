import { getConnection } from "typeorm";
import { Board } from './board.model';
import { Column, ColumnType } from './column.model';


export const getAll = async () =>
  getConnection().getRepository(Board)
      .createQueryBuilder('board')
      .orderBy('board.id')
      .leftJoinAndSelect('board.columns', 'column')
      .getMany();

export const getBoardById = async (boardId: string) =>
  getConnection().getRepository(Board)
      .findOne(boardId, {relations: ['columns']});


export const create = async (title: string, columns: Column[]): Promise<Board> => {
  const board = getConnection().getRepository(Board).create();
  board.title = title;
  board.columns = columns;

  return getConnection().getRepository(Board).save(board);
};


export interface UpdateBoardArg {
  title: string;
  columns: ColumnType[]
}

export const updateBoard = async (boardId: string, title: string, columns: Column[]): Promise<Board|null> => {
  const board = await getConnection().getRepository(Board).findOne(boardId);
  if (!board) {
    return null;
  }
  board.title = title;
  board.columns = columns;
  return getConnection().getRepository(Board).save(board);
};

export const deleteBoard = async (boardId: string) => {
  const result = await getConnection().getRepository(Board)
      .createQueryBuilder('board')
      .delete()
      .where('id = :boardId', {boardId})
      .execute();

  return result.affected! > 0;
};

export const getColumnById = async (columnId: string): Promise<Column | undefined> =>
  getConnection().getRepository(Column)
      .findOne(columnId);

export const createColumn = async (column: Omit<ColumnType, 'id'>) =>
  getConnection().getRepository(Column)
      .save(column);

export const updateColumn = async (column: ColumnType): Promise<Column> => {
  const repo = getConnection().getRepository(Column);
  const col = await repo
      .findOne(column.id);

  if (!col) {
    throw new Error('Column not found');
  }
  col.title = column.title;
  col.order = column.order;

  return repo.save(col);
}
