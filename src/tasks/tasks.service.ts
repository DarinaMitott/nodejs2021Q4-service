import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "uuid";
import { Task } from "../entities/task";
import { TaskResponse } from "./tasks.interface";
import { TaskNewDto, TaskUpdateDto } from "./dto";
import { BoardsService } from "../boards/boards.service";
import { BoardResponse } from "../boards/boards.interface";
import { UsersService } from "../users/users.service";

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task)
              private readonly tasksRepository: Repository<Task>,
              private readonly boardsService: BoardsService,
              private readonly usersService: UsersService,
  ) {}

  async getOneOrMany(boardId: string, taskId: string|null): Promise<TaskResponse|TaskResponse[]> {
    if (taskId) {
      const result = await this.tasksRepository.createQueryBuilder('task')
        .where('"task"."boardId" = :boardId', {boardId})
        .andWhere('"task"."id" = :taskId', {taskId})
        .getOne();
      if (!result) {
        throw new NotFoundException({error: 'Task not found'});
      }
      return Task.toResponse(result);
    }
    const result = await this.tasksRepository.createQueryBuilder('task')
      .where('"task"."boardId" = :boardId', {boardId})
      .orderBy('"task"."id"')
      .getMany();
    return Promise.all(result.map(Task.toResponse));
  }

  async create(boardId, taskData: TaskNewDto): Promise<TaskResponse> {
    const {title, order, description, userId, columnId } = taskData;
    let user = null;
    if (userId) {
      user = await this.usersService.getOneOrManyOrThrow(userId);
      if (!user) {
        throw new BadRequestException({error: 'User not found'});
      }
    }
    const board = (await this.boardsService.getOneOrMany(boardId)) as BoardResponse;
    if (!board) {
      throw new NotFoundException({error: 'Board not found'});
    }

    let column = null;
    if (columnId) {
      column = await this.boardsService.getOneOrManyColumnOrThrow(columnId);
    }

    const tmpBoard = this.tasksRepository
      .create({title, order, description, user, board, column});

    return this.tasksRepository.save(tmpBoard)
      .then(task => Task.toResponse(task));
  }

  async update(boardId, taskId, taskData: TaskUpdateDto): Promise<TaskResponse> {
    if (!validate(boardId)) {
      throw new NotFoundException({error: 'Board Id is invalid'});
    }
    if (!validate(taskId)) {
      throw new NotFoundException({error: 'Task Id is invalid'});
    }
    const { userId, columnId, order, description, title} = taskData;

    let user = null;
    if (userId) {
      user = await this.usersService.getOneOrManyOrThrow(userId);
    }

    let column = null;
    if (columnId) {
      column = await this.boardsService.getOneOrManyColumnOrThrow(columnId);
    }

    const result = await this.tasksRepository
      .createQueryBuilder('task')
      .update()
      .set({title, description, order, user, column})
      .where('"task"."boardId" = :boardId AND "task"."id" = :taskId', {boardId, taskId})
      .execute();

    if (result?.affected <= 0) {
      throw new BadRequestException({error: 'task not found'});
    }

    return this.tasksRepository.findOne({ id: taskId })
      .then(task => Task.toResponse(task));
  }

  async remove(boardId, taskId): Promise<boolean> {
    const result = await this.tasksRepository
      .createQueryBuilder('task')
      .delete()
      .where('"task"."id" = :taskId AND "task"."boardId" = :boardId', {taskId, boardId})
      .execute();
    return result?.affected > 0;
  }

  async unassignUser(userId: string) {
    await this.tasksRepository
      .createQueryBuilder('task')
      .update()
      .set({user: null})
      .where('userId = :userId', {userId})
      .execute();
  }
}
