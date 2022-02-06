import { IsNotEmpty } from 'class-validator';

export class UserNewDto {

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;
}