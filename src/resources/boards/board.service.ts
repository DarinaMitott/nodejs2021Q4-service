import boardRepo from './board.memory.repository';
import taskService from '../tasks/task.service';
import { Column } from "./column.model";

export const getAll = () => boardRepo.getAll();
export const getById = (boardId: string) => boardRepo.getById(boardId);
export const create = (title: string, columns: Column[]) => boardRepo.create(title, columns);
export const updateBoard = (boardId: string, {title, columns}) => boardRepo.updateBoard(boardId, {title, columns});
export const deleteBoard = async (boardId: string) => {
    await taskService.deleteBoardTasks(boardId);
    return boardRepo.deleteBoard(boardId);
}

