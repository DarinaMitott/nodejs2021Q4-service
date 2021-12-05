const boardRepo = require('./board.memory.repository');
const taskService = require('../tasks/task.service');

const getAll = () => boardRepo.getAll();
const getById = (boardId) => boardRepo.getById(boardId);
const create = (title, columns) => boardRepo.create(title, columns);
const updateBoard = (boardId, {title, columns}) => boardRepo.updateBoard(boardId, {title, columns});
const deleteBoard = async (boardId) => {
    await taskService.deleteBoardTasks(boardId);
    return boardRepo.deleteBoard(boardId);
}

module.exports = {
    getAll,
    getById,
    create,
    updateBoard,
    deleteBoard,
}
