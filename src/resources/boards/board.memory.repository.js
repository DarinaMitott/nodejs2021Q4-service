const Board = require('./board.model');
const Column = require('./column.model');

const boards = [];

const getAll = async () => boards;
const getById = async (boardId) => boards.find(b => b.id === boardId);
const create = (title, columns) => {
  const cols = columns.map(c => new Column(c));
  const board = new Board({ title, columns: cols });
  boards.push(board);
  return board;
};

const updateBoard = async (boardId, {title, columns}) => {
  const boardIdx = boards.findIndex(b => b.id === boardId);
  if (boardIdx < 0) {
    return null;
  }
  const board = boards[boardIdx];
  board.title = title;
  board.columns = columns.map(c => new Column(c));
  return board;
};

const deleteBoard = async (boardId) => {
  const boardIdx = boards.findIndex(b => b.id === boardId);
  if (boardIdx < 0) {
    return null;
  }
  boards.splice(boardIdx, 1);
  return true;
};


module.exports = {
  getAll,
  getById,
  create,
  updateBoard,
  deleteBoard
}
