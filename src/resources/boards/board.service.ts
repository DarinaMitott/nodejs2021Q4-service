import * as boardRepo from './board.memory.repository';
import * as taskService from '../tasks/task.service';
import { ColumnType } from './column.model';
import { Board } from "./board.model";

export const getAll = () => boardRepo.getAll();
export const getById = (boardId: string) => boardRepo.getById(boardId);
export const create = (title: string, columns: ColumnType[]): Promise<Board> => boardRepo.create(title, columns);
export const updateBoard = (boardId: string, {title, columns}: boardRepo.UpdateBoardArg) => boardRepo.updateBoard(boardId, {title, columns});
export const deleteBoard = async (boardId: string) => {
    await taskService.deleteBoardTasks(boardId);
    return boardRepo.deleteBoard(boardId);
}

