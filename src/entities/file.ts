import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({unique: true})
  originalName!: string;

  @Column()
  uploadedName!: string;
}
