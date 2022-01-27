import { Entity, Column as OrmColumn, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn } from "typeorm";
import { Column } from './column.model';


interface BoardType {
  id?: string;
  title: string;
  columns: Column[];
}

@Entity()
export class Board extends BaseEntity implements BoardType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OrmColumn({default: ''})
  title!: string;

  @OneToMany('Column', 'board')
  @JoinColumn()
  columns!: Column[];
}

