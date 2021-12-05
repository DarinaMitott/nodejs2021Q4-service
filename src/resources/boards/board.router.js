const router = require('express').Router();
const uuid = require('uuid');
const boardService = require('./board.service');
const columnValidator = require('./column.validator');
const tasksRouter = require('../tasks/task.router');


router.route('/(:boardId)?').get(async (req, res) => {
  try {
    const { boardId } = req.params;
    if (boardId) {
      if (!uuid.validate(boardId)) {
        res.status(400).json({error: 'Invalid board id'});
        return;
      }
      const board = await boardService.getById(boardId);
      if (!board) {
        res.status(404).json({error: 'Board not found'});
        return;
      }
      res.status(200).json(board);
      return;
    }
    const boards = await boardService.getAll();
    res.status(200).json(boards);
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

router.route('/').post(async (req, res) => {
  try {
    const { title, columns } = req.body;
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({error: 'Board title is invalid'});
      return;
    }

    const validatedColumns = await columnValidator.validateColumns(columns);
    if (validatedColumns == null) {
      res.status(400).json({error: `columns validation failed`});
      return;
    }

    const newBoard = await boardService.create(title, validatedColumns);
    res.status(201).json(newBoard);
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

router.route('/:boardId').put(async (req, res) => {
  try {
    const { boardId } = req.params;
    if (!uuid.validate(boardId)) {
      res.status(400).json({error: 'invalid board id'});
      return;
    }
    const { title, columns } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({error: 'Invalid board title'});
      return;
    }

    const validatedColumns = await columnValidator.validateColumns(columns);
    if (validatedColumns == null) {
      res.status(400).json({error: `columns validation failed`});
      return;
    }

    const updated = await boardService.updateBoard(boardId, {title, columns: validatedColumns});
    if (!updated) {
      res.status(404).json({error: 'Board not found'});
      return;
    }
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

router.route('/:boardId').delete(async (req, res) => {
  try {
    const { boardId } = req.params;
    if (!uuid.validate(boardId)) {
      res.status(400).json({error: 'invalid board id'});
      return;
    }

    const rv = await boardService.deleteBoard(boardId);
    if (!rv) {
      res.status(404).json({error: 'Not found'});
      return;
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

router.use('/:boardId/tasks', (req, res, next) => {
  req.boardId = req.params.boardId;
  next();
}, tasksRouter);

module.exports = router;
