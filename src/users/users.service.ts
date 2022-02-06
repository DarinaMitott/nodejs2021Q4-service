import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from 'uuid';
import { compare } from 'bcrypt';
import { User } from '../entities/user';
import { UserNewDto, UserUpdateDto } from "./dto";
import { UserResponse } from "./users.interface";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async getOneOrManyOrThrow(userId: string|null) {
    if (userId) {
      const user = await this.usersRepository.findOne({id: userId})
      if (!user) {
        throw new NotFoundException({error: 'User not found'});
      }
      return user;
    }
    return this.usersRepository.find();
  }

  async getByLogin(login: string): Promise<UserResponse | null> {
    if (!login.trim()) {
      throw new BadRequestException({error: 'Invalid login'});
    }
    const user = await this.usersRepository.findOne({login});
    if (user) {
      return user.toResponse();
    }
    return null
  }

  async create(data: UserNewDto): Promise<UserResponse> {
    const { name, login, password } = data;

    const user = this.usersRepository.create({
      name, login, password
    });

    const saved = await this.usersRepository.save(user);
    return saved.toResponse();
  }

  async update(userId: string, data: UserUpdateDto): Promise<UserResponse> {
    if (!validate(userId)) {
      throw new BadRequestException({error: 'UserId is not valid'});
    }

    const user = await this.usersRepository.findOne({id: userId});
    if (!user) {
      throw new NotFoundException({error: 'User not found'});
    }
    const newUser = this.usersRepository.merge(user, data);
    return (await this.usersRepository.save(newUser)).toResponse();
  }

  async remove(userId: string): Promise<boolean> {
    const result = await this.usersRepository.delete({id: userId});
    return result?.affected > 0;
  }

  async loginUser(login: string, password: string): Promise<Partial<User> | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('"user"."login" = :login', {login})
      .addSelect(['user.password'])
      .getOne();

    if (!user) {
      return undefined;
    }

    const result = await compare(password, user.password);
    return result ? user.toResponse() : undefined;
  }


}
