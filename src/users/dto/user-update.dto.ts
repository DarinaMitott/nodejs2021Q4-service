import { IsNotEmpty } from 'class-validator';

export class UserUpdateDto {

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly login: string;

  readonly password?: string | null | undefined;
}