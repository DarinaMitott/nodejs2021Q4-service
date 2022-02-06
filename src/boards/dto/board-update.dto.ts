import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ColumnDto } from "./column.dto";


export class BoardUpdateDto {

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ValidateNested({each: true})
  @IsArray()
  @Type(() => ColumnDto)
  readonly columns: ColumnDto[];

}

