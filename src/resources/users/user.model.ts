import { v4 as uuidV4 } from 'uuid';
import { Entity, Column as OrmColumn, PrimaryGeneratedColumn, Index, BaseEntity, OneToMany } from "typeorm";
import { type Task } from '../tasks/task.model';


type UserType = {
  id: string;
  name: string;
  login: string;
  password: string
}

@Entity()
export class User extends BaseEntity implements UserType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OrmColumn()
  name: string;

  @Index()
  @OrmColumn()
  login: string;

  @Index()
  @OrmColumn({select: false})
  password: string;

  @OneToMany('Task', 'task.user')
  tasks!: Task[];

  constructor({
    id = uuidV4(),
    name = 'USER',
    login = 'user',
    password = 'P@55w0rd'
  } = {}) {
    super();
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  toResponse() {
    return {
      id: this.id,
      name: this.name,
      login: this.login
    }
  }
}

