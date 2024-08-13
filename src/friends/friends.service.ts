import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends, FriendsState } from './entity/friends.entity.js';
import { Repository } from 'typeorm';
import { User } from '../person/user/entities/user.entity.js';
import { Strings } from '../data/strings.js';
import { Entities, Fields } from '../data/enums.js';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(author: string, friend: string) {
    const authorCheck = await this.userRepository.findOneBy({ id: author });

    if (!authorCheck)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, author),
        HttpStatus.BAD_REQUEST,
      );

    const friendCheck = await this.userRepository.findOneBy({ id: friend });
    if (!friendCheck)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, friend),
        HttpStatus.BAD_REQUEST,
      );

    const friendship = await this.friendsRepository.create({
      author: authorCheck,
      friend: friendCheck,
      blockedBy: null,
    });

    const result = await this.friendsRepository.save(friendship);

    return instanceToPlain(result);
  }

  async getUserFriends(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, userId),
        HttpStatus.BAD_REQUEST,
      );

    const friends = await this.friendsRepository
      .createQueryBuilder('friends')
      .leftJoinAndSelect('friends.author', 'author')
      .leftJoinAndSelect('friends.blockedBy', 'blockedBy')
      .leftJoinAndSelect('friends.friend', 'friend')
      .where('friends.authorId = :userId', { userId })
      .orWhere('friends.friendId = :userId', { userId })
      .getMany();

    // Extract and return the list of friends

    return instanceToPlain(friends);
  }

  async removeFriend(user: string, friend: string) {
    const userDoc = await this.userRepository.findOneBy({ id: user });

    if (!userDoc) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, user),
        HttpStatus.BAD_REQUEST,
      );
    }

    const friendCheck = await this.userRepository.findOneBy({ id: friend });
    if (!friendCheck) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, friend),
        HttpStatus.BAD_REQUEST,
      );
    }

    const friendship = await this.friendsRepository
      .createQueryBuilder('friends')
      .leftJoinAndSelect('friends.author', 'author')
      .leftJoinAndSelect('friends.blockedBy', 'blockedBy')
      .leftJoinAndSelect('friends.friend', 'friend')
      .where('(friends.authorId = :user AND friends.friendId = :friend)', {
        user,
        friend,
      })
      .orWhere('(friends.friendId = :user AND friends.authorId = :friend)', {
        user,
        friend,
      })
      .getOne();

    if (!friendship) {
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedFriendship = await this.friendsRepository.delete(
      friendship.id,
    );

    if (deletedFriendship.affected === 0) {
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: Strings.entityDeleted(Entities.Friends),
      friendship: friendship,
    };
  }

  async approveFriendship(approverId: string, friendshipId: string) {
    const approver = await this.userRepository.findOneBy({ id: approverId });
    if (!approver)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, approverId),
        HttpStatus.BAD_REQUEST,
      );

    const friendship = await this.friendsRepository.findOneBy({
      id: friendshipId,
    });
    if (!friendship)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Friends, friendshipId),
        HttpStatus.BAD_REQUEST,
      );

    if (friendship.friend != approver)
      throw new HttpException(
        Strings.notAllowedApproveFriendship,
        HttpStatus.BAD_REQUEST,
      );

    const updatedFriendship = await this.friendsRepository.update(
      { id: friendship.id },
      { status: FriendsState.Friends },
    );
    if (updatedFriendship.affected > 0)
      return {
        message: Strings.approvedFriendship(
          friendship.author.username,
          approver.username,
        ),
      };

    return {
      updatedFriendship,
    };
  }
}
