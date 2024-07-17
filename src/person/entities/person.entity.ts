import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base-entity.class.js';

export class Person extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  emailVerificationToken: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;
}
