import {
  Entity,
  Column as OrmColumn,
  PrimaryGeneratedColumn,
  Index,
  BaseEntity,
  OneToMany,
  BeforeInsert, BeforeUpdate
} from "typeorm";

import { hash } from 'bcrypt';
import { type Task } from './task';
import { HASH_ROUNDS } from "../common/config";


type UserType = {
  id: string;
  name: string;
  login: string;
  password: string
}

@Entity()
export class User extends BaseEntity implements UserType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OrmColumn()
  name!: string;

  @Index()
  @OrmColumn()
  login!: string;

  @BeforeInsert()
  async handlePasswordHashInsert() {
    this.password = await hash(this.password, HASH_ROUNDS);
  }

  @BeforeUpdate()
  async handlePasswordHashUpdate() {
    if (this.password) {
      this.password = await hash(this.password, HASH_ROUNDS);
    }
  }

  @OrmColumn({select: false})
  password!: string;

  @OneToMany('Task', 'task.user')
  tasks!: Task[];

  toResponse() {
    return {
      id: this.id,
      name: this.name,
      login: this.login
    }
  }
}

