const taskRepo = require('./task.memory.repository');

const getAll = (boardId) => taskRepo.getAll(boardId);
const getById = (boardId, taskId) => taskRepo.getById(boardId, taskId);
const unassignUser = (userId) => taskRepo.unassignUser(userId);
const createTask = (boardId, task) => taskRepo.createTask(boardId, task);
const updateTask = (boardId, taskId, toUpdate) => taskRepo.updateTask(boardId, taskId, toUpdate);
const deleteTask = (boardId, taskId) => taskRepo.deleteTask(boardId, taskId);
const deleteBoardTasks = (boardId) => taskRepo.deleteBoardTasks(boardId);

module.exports = {
    getAll,
    getById,
    createTask,
    unassignUser,
    updateTask,
    deleteTask,
    deleteBoardTasks,
}
