import {Task, TaskCreateOrUpdateArg, TaskType} from './task.model';

let tasks: Task[] = [];

export const unassignUser = async (userId: string) => {
  for (let i = 0; i < tasks.length; i += 1){
    const task = tasks[i];
    if (task.userId === userId) {
      task.userId = null;
    }
  }
}

export const getAll = async (boardId: string) => tasks.filter(t => t.boardId === boardId);

export const getById = async (boardId: string, taskId: string) => tasks.find(t => t.boardId === boardId && t.id === taskId)

export const createTask = async (boardId: string, task: TaskCreateOrUpdateArg) => {
  const newTask = new Task({...task, boardId} as TaskType);
  tasks.push(newTask);
  return newTask;
}

export const updateTask = async (boardId: string, taskId: string, toUpdate: TaskCreateOrUpdateArg) => {
  const taskIdx = tasks.findIndex(t => t.boardId === boardId && t.id === taskId);
  if (taskIdx < 0) {
    return null;
  }

  const task = tasks[taskIdx];
  Object.assign(task, toUpdate);
  return task;
};

export const deleteTask = async (boardId: string, taskId: string) => {
  const taskIdx = tasks.findIndex(t => t.boardId === boardId && t.id === taskId);
  if (taskIdx < 0) {
    return null;
  }
  tasks.splice(taskIdx, 1);
  return true;
};

export const deleteBoardTasks = async (boardId: string) => {
  tasks = tasks.filter(b => b.boardId !== boardId);
};
