import { User } from '../../person/user/entities/user.entity.js';
import { Entity, Column, Unique, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../person/entities/base-entity.class.js';

@Entity('likes')
@Unique(['user', 'targetType', 'targetId'])
export class Like extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  targetType: string;

  @Column()
  targetId: string;
}
