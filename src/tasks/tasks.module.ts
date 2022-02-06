import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "../entities/task";
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { User } from "../entities/user";
import { Board } from "../entities/board";
import { Column } from "../entities/column";
import { BoardsService } from "../boards/boards.service";
import { UsersService } from "../users/users.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Board, Column]),
  ],
  controllers: [TasksController],
  providers: [TasksService, BoardsService, UsersService]
})
export class TasksModule {}
