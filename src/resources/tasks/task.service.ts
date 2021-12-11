import * as taskRepo from './task.memory.repository';
import { TaskCreateOrUpdateArg } from "./task.model";

export const getAll = (boardId: string) => taskRepo.getAll(boardId);
export const getById = (boardId: string, taskId: string) => taskRepo.getById(boardId, taskId);
export const unassignUser = (userId: string) => taskRepo.unassignUser(userId);
export const createTask = (boardId: string, task: TaskCreateOrUpdateArg) => taskRepo.createTask(boardId, task);
export const updateTask = (boardId: string, taskId: string, toUpdate: TaskCreateOrUpdateArg) => taskRepo.updateTask(boardId, taskId, toUpdate);
export const deleteTask = (boardId: string, taskId: string) => taskRepo.deleteTask(boardId, taskId);
export const deleteBoardTasks = (boardId: string) => taskRepo.deleteBoardTasks(boardId);

