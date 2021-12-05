const router = require('express').Router();
const uuid = require('uuid');
const taskService = require('./task.service');
const { TaskNotFoundError } = require('../../common/errors');
const taskValidator = require("./task.validator");

router.route('/(:taskId)?').get(async (req, res) => {
  try {
    if (!uuid.validate(req.boardId)) {
      res.status(400).json({error: 'board id is invalid'});

      return;
    }
    const { taskId } = req.params;
    if (taskId !== undefined) {
      if (!uuid.validate(taskId)) {
        res.status(400).json({error: 'Invalid task id'});
        return;
      }
      const task = await taskService.getById(req.boardId, taskId);
      if (!task) {
        res.status(404).json({error: 'Task not found'});
        return;
      }
      res.status(200).json(task);
      return;
    }
    const tasks = await taskService.getAll(req.boardId);
    res.status(200).json(tasks);
  } catch (e) {
    if (e instanceof TaskNotFoundError) {
      res.status(404).json({error: 'Task not found'});
      return
    }
    res.status(500).json({error: e.toString()});
  }
});

router.route('/').post(async (req, res) => {
  try {
    if (!uuid.validate(req.boardId)) {
      res.status(400).json({error: 'board id is invalid'});
      return;
    }

    const validatedTask = await taskValidator.validate(req.body);
    if (!validatedTask) {
      res.status(400).json({error: 'task validation failed'});
      return;
    }

    const newTask = await taskService.createTask(req.boardId, validatedTask);
    res.status(201).json(newTask);
  } catch (e) {
    if (e instanceof TaskNotFoundError) {
      res.status(404).json({error: 'Task not found'});
      return
    }
    res.status(500).json({error: e.toString()});
  }
});

router.route('/:taskId').put(async (req, res) => {
  try {
    if (!uuid.validate(req.boardId)) {
      res.status(400).json({error: 'board id is invalid'});
      return;
    }

    const { taskId } = req.params;
    if (!uuid.validate(taskId)) {
      res.status(400).json({error: 'task id is invalid'});
      return;
    }

    const validatedTask = await taskValidator.validate(req.body);
    if (!validatedTask) {
      res.status(400).json({error: 'task validation failed'});
      return;
    }

    const updatedTask = await taskService.updateTask(req.boardId, taskId, validatedTask);
    if (!updatedTask) {
      res.status(400).json({error: 'task validation failed'});
      return;
    }

    res.json(updatedTask);
  } catch (e) {
    if (e instanceof TaskNotFoundError) {
      res.status(404).json({error: 'Task not found'});
      return
    }
    res.status(500).json({error: e.toString()});
  }
});

router.route('/:taskId').delete(async (req, res) => {
  try {
    if (!uuid.validate(req.boardId)) {
      res.status(400).json({error: 'board id is invalid'});
      return;
    }

    const { taskId } = req.params;
    if (!uuid.validate(taskId)) {
      res.status(400).json({error: 'task id is invalid'});
      return;
    }

    const deleted = await taskService.deleteTask(req.boardId, taskId);
    if (!deleted) {
      res.status(404).json({error: 'Task not found'});
      return;
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({error: e.toString()});
  }
});

module.exports = router;
