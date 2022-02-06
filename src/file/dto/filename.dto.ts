import { IsString, Matches } from "class-validator";

export class FilenameDto {
  @IsString()
  @Matches(/^[a-z0-9._-]+$/im)
  filename: string;
}