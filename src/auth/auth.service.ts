import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../entities/user";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService) {
  }

  async validate(login: string, password: string): Promise<object | null> {
    const user = await this.usersService.loginUser(login, password);
    if (user) {
      return user;
    }
    return null
  }

  async login(user: Partial<User>) {
    const payload = {userId: user.id, login: user.login};
    return { token: this.jwtService.sign(payload) };
  }
}
