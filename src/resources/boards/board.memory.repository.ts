import { Board } from './board.model';
import { Column } from './column.model';

const boards: Board[] = [];

export const getAll = async () => boards;
export const getById = async (boardId: string) => boards.find(b => b.id === boardId);
export const create = async (title: string, columns: Column[]): Promise<Board> => {
  const cols: Column[] = columns.map(c => new Column(c));
  const board: Board = new Board({ title, columns: cols });
  boards.push(board);
  return board;
};


interface UpdateBoardArg {
  title: string;
  columns: Column[]
}

export const updateBoard = async (boardId: string, {title, columns}: UpdateBoardArg) => {
  const boardIdx = boards.findIndex(b => b.id === boardId);
  if (boardIdx < 0) {
    return null;
  }
  const board = boards[boardIdx];
  board.title = title;
  board.columns = columns.map((c: Column) => new Column(c));
  return board;
};

export const deleteBoard = async (boardId: string) => {
  const boardIdx = boards.findIndex(b => b.id === boardId);
  if (boardIdx < 0) {
    return null;
  }
  boards.splice(boardIdx, 1);
  return true;
};

