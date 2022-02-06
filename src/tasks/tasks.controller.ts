import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TaskResponse } from "./tasks.interface";
import { TaskNewDto, TaskUpdateDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('/boards/:boardId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':taskId?')
  async getOneOrMany(@Param('boardId', ParseUUIDPipe) boardId, @Param() params): Promise<TaskResponse | TaskResponse[]> {
    return this.tasksService.getOneOrMany(boardId, params.taskId);
  }

  @HttpCode(201)
  @Post()
  async create(@Param('boardId', ParseUUIDPipe) boardId, @Body() taskData: TaskNewDto): Promise<TaskResponse> {
    return this.tasksService.create(boardId, taskData);
  }

  @Put(':taskId')
  async update(@Param('boardId', ParseUUIDPipe) boardId, @Param('taskId', ParseUUIDPipe) taskId: string, @Body() taskData: TaskUpdateDto): Promise<TaskResponse> {
    return this.tasksService.update(boardId, taskId, taskData);
  }

  @HttpCode(204)
  @Delete(':taskId')
  async remove(@Param('boardId', ParseUUIDPipe) boardId, @Param('taskId', ParseUUIDPipe) taskId: string) {
    await this.tasksService.remove(boardId, taskId);
  }
}
