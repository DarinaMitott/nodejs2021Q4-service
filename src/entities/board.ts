import { Entity, Column as OrmColumn, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn } from "typeorm";
import { Column } from './column';



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

  @OneToMany('Column', 'board', {onDelete: 'CASCADE'})
  @JoinColumn()
  columns!: Column[];
  // @OrmColumn({type: 'json', nullable: false})
  // columns: Column[];
}

