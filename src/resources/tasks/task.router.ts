import { Router, Request, Response } from 'express';
import { validate } from 'uuid';
import * as taskService from './task.service';
import { validateTask } from "./task.validator";
import { Task, TaskCreateOrUpdateArg } from "./task.model";

export const router: Router = Router();

interface RequestWithBoardId extends Request {
  boardId: string;
}

router.route('/(:taskId)?').get(async (req: Request, res: Response) => {
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
    taskService.getById((req as RequestWithBoardId).boardId, taskId)
        .then((task: Task | undefined) => {
          if (!task) {
            res.status(404).json({error: 'Task not found'});
          } else {
            res.status(200).json(task);
          }
        })
        .catch(e => res.status(500).json({error: (e as Error).toString()}));
    return;
  }
  taskService.getAll((req as RequestWithBoardId).boardId)
      .then(tasks => {
        res.status(200).json(tasks);
      })
      .catch(e => res.status(500).json({error: (e as Error).toString()}));
});

router.route('/').post(async (req: Request, res: Response) => {
  const {boardId} = req as RequestWithBoardId;
  if (!validate(boardId)) {
    res.status(400).json({error: 'board id is invalid'});
    return;
  }

  validateTask(req.body)
    .then((validatedTask: TaskCreateOrUpdateArg | null) => {
      if (!validatedTask) {
        res.status(400).json({error: 'task validation failed'});
        return undefined;
      }
      return validatedTask;
    })
    .then((validatedTask: TaskCreateOrUpdateArg | undefined) => validatedTask && taskService.createTask(boardId, validatedTask))
    .then(newTask => res.status(201).json(newTask))
    .catch(e => res.status(500).json({error: (e as Error).toString()}));
});

router.route('/:taskId').put(async (req: Request, res: Response) => {
  if (!validate((req as RequestWithBoardId).boardId)) {
    res.status(400).json({error: 'board id is invalid'});
    return;
  }

  const { taskId } = req.params;
  if (!validate(taskId)) {
    res.status(400).json({error: 'task id is invalid'});
    return;
  }

  validateTask(req.body)
    .then((validatedTask) => {
      if (!validatedTask) {
        res.status(400).json({error: 'task validation failed'});
        return undefined;
      }
      return taskService.updateTask((req as RequestWithBoardId).boardId, taskId, validatedTask);
    })
    .then(updatedTask => {
      if (!updatedTask) {
        res.status(400).json({error: 'task validation failed'});
        return;
      }
      res.json(updatedTask);
    })
    .catch(e => res.status(500).json({error: (e as Error).toString()}));
});

router.route('/:taskId').delete(async (req: Request, res: Response) => {
  if (!validate((req as RequestWithBoardId).boardId)) {
    res.status(400).json({error: 'board id is invalid'});
    return;
  }

  const { taskId } = req.params;
  if (!validate(taskId)) {
    res.status(400).json({error: 'task id is invalid'});
    return;
  }

  taskService.deleteTask((req as RequestWithBoardId).boardId, taskId)
    .then(deleted => {
      if (!deleted) {
        res.status(404).json({error: 'Task not found'});
        return;
      }
      res.status(204).send();

    })
    .catch(e => res.status(500).json({error: (e as Error).toString()}));
});

