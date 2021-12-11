import { Router, Request, Response } from 'express';
import { validate } from 'uuid';
import * as taskService from './task.service';
import { TaskNotFoundError } from '../../common/errors';
import { validateTask } from "./task.validator";
import {TaskCreateOrUpdateArg} from "./task.model";

export const router: Router = Router();

interface RequestWithBoardId extends Request {
  boardId: string;
}

router.route('/(:taskId)?').get(async (req: Request, res: Response) => {
  try {
    if (!validate((req as RequestWithBoardId).boardId)) {
      res.status(400).json({error: 'board id is invalid'});

      return;
    }
    const { taskId } = req.params;
    if (taskId !== undefined) {
      if (!validate(taskId)) {
        res.status(400).json({error: 'Invalid task id'});
        return;
      }
      const task = await taskService.getById((req as RequestWithBoardId).boardId, taskId);
      if (!task) {
        res.status(404).json({error: 'Task not found'});
        return;
      }
      res.status(200).json(task);
      return;
    }
    const tasks = await taskService.getAll((req as RequestWithBoardId).boardId);
    res.status(200).json(tasks);
  } catch (e) {
    if (e instanceof TaskNotFoundError) {
      res.status(404).json({error: 'Task not found'});
      return
    }
    res.status(500).json({error: (e as Error).toString()});
  }
});

router.route('/').post(async (req: Request, res: Response) => {
  try {
    const boardId: string = (req as RequestWithBoardId).boardId;
    if (!validate(boardId)) {
      res.status(400).json({error: 'board id is invalid'});
      return;
    }

    const validatedTask: TaskCreateOrUpdateArg | null = await validateTask(req.body);
    if (!validatedTask) {
      res.status(400).json({error: 'task validation failed'});
      return;
    }

    const newTask = await taskService.createTask(boardId, validatedTask);
    res.status(201).json(newTask);
  } catch (e) {
    if (e instanceof TaskNotFoundError) {
      res.status(404).json({error: 'Task not found'});
      return
    }
    res.status(500).json({error: (e as Error).toString()});
  }
});

router.route('/:taskId').put(async (req: Request, res: Response) => {
  try {
    if (!validate((req as RequestWithBoardId).boardId)) {
      res.status(400).json({error: 'board id is invalid'});
      return;
    }

    const { taskId } = req.params;
    if (!validate(taskId)) {
      res.status(400).json({error: 'task id is invalid'});
      return;
    }

    const validatedTask = await validateTask(req.body);
    if (!validatedTask) {
      res.status(400).json({error: 'task validation failed'});
      return;
    }

    const updatedTask = await taskService.updateTask((req as RequestWithBoardId).boardId, taskId, validatedTask);
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
    res.status(500).json({error: (e as Error).toString()});
  }
});

router.route('/:taskId').delete(async (req: Request, res: Response) => {
  try {
    if (!validate((req as RequestWithBoardId).boardId)) {
      res.status(400).json({error: 'board id is invalid'});
      return;
    }

    const { taskId } = req.params;
    if (!validate(taskId)) {
      res.status(400).json({error: 'task id is invalid'});
      return;
    }

    const deleted = await taskService.deleteTask((req as RequestWithBoardId).boardId, taskId);
    if (!deleted) {
      res.status(404).json({error: 'Task not found'});
      return;
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({error: (e as Error).toString()});
  }
});

