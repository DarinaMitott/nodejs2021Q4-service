import { Entity, Column as OrmColumn, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { type User } from '../users/user.model';
import { type Board } from '../boards/board.model';
import { type Column } from '../boards/column.model';


export type TaskType = {
  id: string;
  title: string;
  order: number;
  description?: string;
  user?: User | null;
  board: Board | null;
  column: Column | null;
}

export type TaskParamData = {
  id?: string | null;
  title: string;
  order: number;
  description?: string;
  userId?: string | null;
  boardId: string | null;
  columnId: string | null;
}

export type TaskUserArg = Partial<TaskType>;
export type TaskCreateOrUpdateObj = Omit<TaskType, 'id' | 'user' | 'board' | 'column'>;
export type TaskCreateOrUpdateArg = Omit<TaskParamData, 'id'>;

@Entity()
export class Task extends BaseEntity implements TaskType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OrmColumn()
  title!: string;

  @OrmColumn()
  order!: number;

  @OrmColumn()
  description?: string;

  @ManyToOne('User', 'tasks', { nullable: true, cascade: true, onDelete: 'SET NULL'})
  @JoinColumn()
  user?: User | null;

  @RelationId((task: Task) => task.user)
  userId?: string | null;

  @ManyToOne('Board', 'tasks', { nullable: true, cascade: true, onDelete: 'CASCADE'})
  @JoinColumn()
  board!: Board | null;

  @RelationId((task: Task) => task.board)
  boardId!: string | null;

  @ManyToOne('Column', 'tasks', { nullable: true, cascade: true, onDelete: 'CASCADE'})
  @JoinColumn()
  column!: Column | null;

  @RelationId((task: Task) => task.column)
  columnId!: string | null;

  static async toResponse(task: Task): Promise<TaskParamData> {
    const { id, title, order, description, userId, boardId, columnId } = task;
    return {
      id,
      title,
      order,
      description,
      userId,
      boardId,
      columnId
    };
  }

  static async stripRelationIds(task: Task): Promise<TaskType> {
    const { id, title, order, description, user, board, column } = task;
    return {
      id,
      title,
      order,
      description,
      user,
      board,
      column
    }
  }
}
