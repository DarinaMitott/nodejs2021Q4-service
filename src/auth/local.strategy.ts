import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login'
    });
  }

  async validate(login: string, password: string) {
    const user = await this.authService.validate(login, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}