import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "uuid";
import { Board } from "../entities/board";
import {BoardResponse, ColumnResponse} from "./boards.interface";
import {BoardNewDto, BoardUpdateDto, ColumnDto} from "./dto";
import { Column } from "../entities/column";

@Injectable()
export class BoardsService {
  constructor( @InjectRepository(Board)
               private readonly boardsRepository: Repository<Board>,
               @InjectRepository(Column)
               private readonly columnsRepository: Repository<Column>,
  ) {}

  async getOneOrMany(boardId: string | null): Promise<BoardResponse | BoardResponse[]> {
    if (boardId) {
      const board = await this.boardsRepository.findOne({id: boardId}, {relations: ['columns']});
      if (!board) {
        throw new NotFoundException({error: 'Board not found'});
      }
      return board;
    }

    return this.boardsRepository.find({relations: ['columns']});
  }

  async create(boardData: BoardNewDto): Promise<BoardResponse> {
    const { title, columns } = boardData;
    const cols = await Promise.all(columns.map(this.createColumn, this));

    const tmpBoard = this.boardsRepository.create({title, columns: cols});
    return this.boardsRepository.save(tmpBoard);
  }

  async update(boardId: string, boardData: BoardUpdateDto): Promise<BoardResponse> {
    if (!validate(boardId)) {
      throw new BadRequestException({error: 'Invalid boardId specified'});
    }
    const oldBoard = await this.boardsRepository.findOne({id: boardId}, {relations: ['columns']});
    if (!oldBoard) {
      throw new NotFoundException({error: 'Board not found'});
    }

    const newBoard = this.boardsRepository.merge(oldBoard, boardData);
    return this.boardsRepository.save(newBoard);
  }

  async remove(boardId: string): Promise<boolean> {
    const result = await this.boardsRepository.delete({id: boardId});
    return result?.affected > 0;
  }

  async createColumn(column: ColumnDto): Promise<ColumnResponse> {
    const { title, order } = column;
    return this.columnsRepository.save({title, order});
  }

  async getOneOrManyColumnOrThrow(columnId: string | null): Promise<ColumnResponse|ColumnResponse[]> {
    if (columnId) {
      const column = await this.columnsRepository.findOne({id: columnId});
      if (!column) {
        throw new NotFoundException({error: 'column not found'});
      }
      return column;
    }

    return this.columnsRepository.find();
  }

  async updateColumn(columnId: string, column: ColumnDto): Promise<ColumnResponse> {
    const col = await this.columnsRepository
        .findOne(columnId);
    if (!col) {
      throw new NotFoundException({error: 'Column not found'});
    }
    col.title = column.title;
    col.order = column.order;

    return this.columnsRepository.save(col);
  }
}
