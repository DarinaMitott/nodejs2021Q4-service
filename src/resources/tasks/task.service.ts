import * as taskRepo from './task.memory.repository';
import { Task, TaskCreateOrUpdateArg } from "./task.model";
import { getById as getUserById } from '../users/user.service';
import { getColumnById, getBoardById } from '../boards/board.memory.repository';

export const getAll = (boardId: string) => taskRepo.getAll(boardId);
export const getById = (boardId: string, taskId: string) => taskRepo.getById(boardId, taskId);
export const unassignUser = (userId: string) => taskRepo.unassignUser(userId);


export const createTask = async (boardId: string, task: TaskCreateOrUpdateArg) => {
    const { columnId } = task;
    const column = (columnId ? await getColumnById(columnId) : null) || null;
    const board = (boardId ? await getBoardById(boardId) : null) || null;
    let user;
    if (task.userId) {
        user = await getUserById(task.userId);
        if (!user) {
            throw new Error('User not found');
        }
    }
    return taskRepo.createTask(board, column, user || null, task);
}

export const updateTask = async (boardId: string, taskId: string, toUpdate: TaskCreateOrUpdateArg) => {
    const board = await getBoardById(boardId);
    if (!board) {
        throw new Error('Board not found');
    }
    const task = await taskRepo.getById(boardId, taskId);
    if (!task) {
        throw new Error('Task not found');
    }
    const merged = await Task.stripRelationIds(task);
    merged.board = board;

    if (!toUpdate.userId) {
        merged.user = null;
    } else {
        const user = await getUserById(toUpdate.userId);
        if (!user) {
            throw new Error('User not found');
        }
        merged.user = user;
    }

    merged.title = toUpdate.title;
    merged.description = toUpdate.description;
    merged.order = toUpdate.order;

    if (merged.column?.id !== toUpdate.columnId) {
        merged.column = (toUpdate.columnId ? await getColumnById(toUpdate.columnId) : null) || null;
    }
    return taskRepo.updateTask(boardId, taskId, merged as Task)
        .then((t: Task | null) => t ? Task.toResponse(t) : null);
}

export const deleteTask = (boardId: string, taskId: string) => taskRepo.deleteTask(boardId, taskId);
export const deleteBoardTasks = (boardId: string) => taskRepo.deleteBoardTasks(boardId);

