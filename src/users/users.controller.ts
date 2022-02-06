import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Body,
  OnApplicationBootstrap,
  UseGuards, ParseUUIDPipe
} from "@nestjs/common";
import { getConnection } from "typeorm";
import { UsersService } from "./users.service";
import { UserNewDto, UserUpdateDto } from "./dto";
import { UserResponse } from "./users.interface";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController implements OnApplicationBootstrap {
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const conn = getConnection();
    await conn.runMigrations();

    const admin = await this.usersService.getByLogin('admin');
    if (!admin) {
      await this.usersService.create({name: 'admin', login: 'admin', password: 'admin'});
    }
  }

  @Get(':userId?')
  async getUserOrUsers(@Param() params) {
    return this.usersService.getOneOrManyOrThrow(params.userId);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() userData: UserNewDto): Promise<UserResponse> {
    return this.usersService.create(userData);
  }

  @Put(':userId')
  async update(@Param('userId', ParseUUIDPipe) userId: string, @Body() userData: UserUpdateDto): Promise<UserResponse> {
    return this.usersService.update(userId, userData);
  }

  @HttpCode(204)
  @Delete(':userId')
  async remove(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.usersService.remove(userId);
  }
}
