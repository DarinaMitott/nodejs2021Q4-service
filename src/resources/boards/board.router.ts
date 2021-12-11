import { Router, Request, Response } from 'express';
import { validate } from 'uuid';
import * as boardService from './board.service';
import { validateColumns } from './column.validator';
import { router as tasksRouter} from '../tasks/task.router';
import { ColumnArgType, ColumnType } from "./column.model";
import {Board} from "./board.model";
import {UpdateBoardArg} from "./board.memory.repository";


export const router: Router = Router()

router.route('/(:boardId)?').get(async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    if (boardId) {
      if (!validate(boardId)) {
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
  } catch (e: unknown) {
    res.status(500).json({error: (e as Error).toString()});
  }
});

router.route('/').post(async (req: Request, res: Response) => {
  const { title, columns } = req.body;
  if (typeof title !== 'string' || !title.trim()) {
    res.status(400).json({error: 'Board title is invalid'});
    return;
  }

  validateColumns(columns)
      .then((validatedColumns: ColumnArgType[] | null): Promise<Board> | undefined => {
        if (validatedColumns != null) {
          return boardService.create(title, validatedColumns as ColumnType[])
        }
        res.status(400).json({error: `columns validation failed`});
        return undefined;
      })
      .then(newBoard => {
        res.status(201).json(newBoard);
      })
      .catch(e => {
        res.status(500).json({error: e.toString()});
      })
});

router.route('/:boardId').put(async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    if (!validate(boardId)) {
      res.status(400).json({error: 'invalid board id'});
      return;
    }
    const { title, columns } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({error: 'Invalid board title'});
      return;
    }

    const validatedColumns = await validateColumns(columns);
    if (validatedColumns == null) {
      res.status(400).json({error: `columns validation failed`});
      return;
    }

    const updated = await boardService.updateBoard(boardId, {title, columns: validatedColumns} as UpdateBoardArg);
    if (!updated) {
      res.status(404).json({error: 'Board not found'});
      return;
    }
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({error: (e as Error).toString()});
  }
});

router.route('/:boardId').delete(async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    if (!validate(boardId)) {
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
    res.status(500).json({error: (e as Error).toString()});
  }
});

interface RequestWithBoardId extends Request {
  boardId: string;
}

router.use('/:boardId/tasks', (req, res, next) => {
  (req as RequestWithBoardId).boardId = req.params.boardId;
  next();
}, tasksRouter);


