import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";


export class TaskUpdateDto {

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly order: number;

  @IsOptional()
  @IsString()
  readonly description?: string;

  readonly userId?: string | null;

  @IsNotEmpty()
  readonly boardId: string | null;

  @IsOptional()
  readonly columnId: string | null;

}
