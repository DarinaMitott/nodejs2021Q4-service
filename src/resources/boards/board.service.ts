import * as boardRepo from './board.memory.repository';
import * as taskService from '../tasks/task.service';
import { ColumnType } from './column.model';
import { Board } from "./board.model";

export const getAll = () => boardRepo.getAll();
export const getById = (boardId: string) => boardRepo.getBoardById(boardId);
export const create = async (title: string, columns: ColumnType[]): Promise<Board> => {
  const cols = await Promise.all(columns.map(boardRepo.createColumn));
  return boardRepo.create(title, cols);
}

export const updateBoard = async (boardId: string, title: string, columns: ColumnType[]) => {
  const cols = await Promise.all(columns.map(boardRepo.updateColumn));

  return boardRepo.updateBoard(boardId, title, cols);
}

export const deleteBoard = async (boardId: string) => {
  await taskService.deleteBoardTasks(boardId);
  return boardRepo.deleteBoard(boardId);
}

