import { BaseEntity } from '../../person/entities/base-entity.class.js';
import { User } from '../../person/user/entities/user.entity.js';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';

export enum FriendsState {
  Friends = 'Friends',
  Pending = 'Pending',
  Blocked = 'Blocked',
}

export enum FriendshipType {
  Close = 'Close Friend',
  Other = 'Other',
}

@Entity('friends')
@Unique(['author', 'friend'])
export class Friends extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'friendId' })
  friend: User;

  @Column({
    type: 'enum',
    enum: FriendsState,
    default: FriendsState.Pending,
  })
  status: FriendsState;

  @ManyToOne(() => User, { nullable: true })
  blockedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'enum', enum: FriendshipType, default: FriendshipType.Other })
  friendshipType: FriendshipType;
}
