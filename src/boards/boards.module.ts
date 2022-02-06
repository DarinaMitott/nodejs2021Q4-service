import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "../entities/board";
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Column } from "../entities/column";

@Module({
  imports: [TypeOrmModule.forFeature([Board, Column])],
  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule {}
