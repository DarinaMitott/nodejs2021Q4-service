import { Entity, Column as OrmColumn, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { type Board } from './board.model';

export type ColumnType = {
  id?: string;
  title: string;
  order: number;
  boardId?: string;
};

export type ColumnArgType = Partial<ColumnType>;

@Entity()
export class Column extends BaseEntity implements ColumnType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OrmColumn()
  title!: string;

  @OrmColumn({default: '0'})
  order!: number;

  @ManyToOne('Board', 'columns', {nullable: true, onDelete: 'CASCADE'})
  @JoinColumn()
  board?: Board;
}

