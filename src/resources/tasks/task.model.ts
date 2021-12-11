import { v4 as uuidV4 } from "uuid";

export type TaskType = {
  id: string;
  title: string;
  order: number;
  description?: string;
  userId: string | null;
  boardId: string | null;
  columnId: string | null;
}

export type TaskUserArg = Partial<TaskType>;
export type TaskCreateOrUpdateArg = Omit<TaskType, 'id'>;

export class Task implements TaskType {
  id: string;

  title: string;

  order: number;

  description?: string;

  userId: string | null;

  boardId: string | null;

  columnId: string | null;

  constructor({
    id = uuidV4(),
    title,
    order,
    description,
    userId = null, // assignee
    boardId,
    columnId
  }: TaskType) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.description = description;
    this.userId = userId;
    this.boardId = boardId;
    this.columnId = columnId;
  }
}
