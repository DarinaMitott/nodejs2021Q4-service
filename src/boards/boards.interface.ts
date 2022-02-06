
export interface ColumnResponse {
  id: string;
  title: string;
  order: number;
}

export interface BoardResponse {
  id: string;

  title: string;

  columns: ColumnResponse[];
}
