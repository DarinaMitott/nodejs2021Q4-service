import uuid from "uuid";

type TaskType = {
  id: string;
  title: string;
  order: number;
  description?: string;
  userId: string | null;
  boardId: string | null;
  columnId: string | null;
}

export class Task implements  TaskType {
  id: string;

  title: string;

  order: number;

  description?: string;

  userId: string | null;

  boardId: string | null;

  columnId: string | null;

  constructor({
    id = uuid.v4(),
    title,
    order,
    description,
    userId = null, // assignee
    boardId,
    columnId
  }) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.description = description;
    this.userId = userId;
    this.boardId = boardId;
    this.columnId = columnId;
  }
}
