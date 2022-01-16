import { getConnection } from "typeorm";
import { Task, TaskCreateOrUpdateObj, TaskParamData } from './task.model';
import { type Board } from '../boards/board.model';
import { type Column } from '../boards/column.model';
import { type User } from '../users/user.model';



export const unassignUser = async (userId: string) =>
  getConnection().getRepository(Task)
      .createQueryBuilder('task')
      .update()
      .set({user: null})
      .where('userId = :userId', {userId})
      .execute();


export const getAll = async (boardId: string) =>
  getConnection().getRepository(Task)
      .createQueryBuilder('task')
      .where('"task"."boardId" = :boardId', {boardId})
      .orderBy('"task"."id"')
      .getMany();


export const getById = async (boardId: string, taskId: string): Promise<Task | undefined> =>
  getConnection().getRepository(Task)
      .createQueryBuilder('task')
      .where('"task"."boardId" = :boardId', {boardId})
      .andWhere('"task"."id" = :taskId', {taskId})
      .getOne();


export const createTask = async (board: Board | null, column: Column | null, user: User | null, task: TaskCreateOrUpdateObj): Promise<TaskParamData> => {
  const repo = getConnection().getRepository(Task);
  const newTask = repo.create();
  repo.merge(newTask, task);

  newTask.user = user;
  newTask.board = board;
  newTask.column = column;
  return repo.save(newTask)
      .then((t: Task) => Task.toResponse(t));
}

export const updateTask = async (boardId: string, taskId: string, toUpdate: Task) => {
  const result = await getConnection().getRepository(Task)
      .createQueryBuilder('task')
      .update()
      .set(toUpdate)
      .where('boardId = :boardId AND id = :taskId', {boardId, taskId})
      .execute();
  if (!result.affected) {
    return null;
  }

  return toUpdate;
};

export const deleteTask = async (boardId: string, taskId: string) => {
  const result = await getConnection().getRepository(Task)
      .createQueryBuilder('task')
      .delete()
      .where('id = :taskId AND boardId = :boardId', {taskId, boardId})
      .execute();
  return result.affected! > 0;
};

export const deleteBoardTasks = async (boardId: string) => {
  await getConnection().getRepository(Task)
      .createQueryBuilder('task')
      .delete()
      .where('boardId = :boardId', {boardId})
      .execute();
};
