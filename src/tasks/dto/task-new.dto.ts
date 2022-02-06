import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";


export class TaskNewDto {

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  readonly order: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  userId?: string | null;

  @IsOptional()
  @IsUUID(5)
  columnId?: string | null;

}