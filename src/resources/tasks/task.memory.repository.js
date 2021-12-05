const Task = require('./task.model');

let tasks = [];

const unassignUser = async (userId) => {
  for (let i = 0; i < tasks.length; i += 1){
    const task = tasks[i];
    if (task.userId === userId) {
      task.userId = null;
    }
  }
}

const getAll = async (boardId) => tasks.filter(t => t.boardId === boardId);

const getById = async (boardId, taskId) => tasks.find(t => t.boardId === boardId && t.id === taskId)

const createTask = async (boardId, task) => {
  const newTask = new Task({...task, boardId});
  tasks.push(newTask);
  return newTask;
}

const updateTask = async (boardId, taskId, toUpdate) => {
  const taskIdx = tasks.findIndex(t => t.boardId === boardId && t.id === taskId);
  if (taskIdx < 0) {
    return null;
  }

  const task = tasks[taskIdx];
  Object.assign(task, toUpdate);
  return task;
};

const deleteTask = async (boardId, taskId) => {
  const taskIdx = tasks.findIndex(t => t.boardId === boardId && t.id === taskId);
  if (taskIdx < 0) {
    return null;
  }
  tasks.splice(taskIdx, 1);
  return true;
};

const deleteBoardTasks = async (boardId) => {
  tasks = tasks.filter(b => b.boardId !== boardId);
};

module.exports = {
  unassignUser,
  getAll,
  getById,
  createTask,
  updateTask,
  deleteTask,
  deleteBoardTasks,
}
