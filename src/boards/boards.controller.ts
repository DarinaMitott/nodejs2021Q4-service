import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { BoardNewDto, BoardUpdateDto } from "./dto";
import { BoardResponse } from "./boards.interface";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get(':boardId?')
  async getOneOrMany(@Param() params): Promise<BoardResponse | BoardResponse[]> {
    return this.boardsService.getOneOrMany(params.boardId);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() boardData: BoardNewDto): Promise<BoardResponse> {
    return this.boardsService.create(boardData);
  }

  @Put(':boardId')
  async update(@Param('boardId', ParseUUIDPipe) boardId: string, @Body() boardData: BoardUpdateDto): Promise<BoardResponse> {
    return this.boardsService.update(boardId, boardData);
  }

  @HttpCode(204)
  @Delete(':boardId')
  async remove(@Param('boardId', ParseUUIDPipe) boardId: string) {
    await this.boardsService.remove(boardId);
  }
}
