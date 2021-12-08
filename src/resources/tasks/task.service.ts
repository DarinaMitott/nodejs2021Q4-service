import * as taskRepo from './task.memory.repository';

export const getAll = (boardId: string) => taskRepo.getAll(boardId);
export const getById = (boardId: string, taskId: string) => taskRepo.getById(boardId, taskId);
export const unassignUser = (userId) => taskRepo.unassignUser(userId);
export const createTask = (boardId, task) => taskRepo.createTask(boardId, task);
export const updateTask = (boardId, taskId, toUpdate) => taskRepo.updateTask(boardId, taskId, toUpdate);
export const deleteTask = (boardId, taskId) => taskRepo.deleteTask(boardId, taskId);
export const deleteBoardTasks = (boardId) => taskRepo.deleteBoardTasks(boardId);

