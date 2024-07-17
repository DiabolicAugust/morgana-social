import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { Strings } from '../../data/strings.js';
import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { Entities, Fields } from '../../data/enums.js';
import { UpdateUserDto } from './entities/dto/update-user.dto.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EncryptService } from '../authorization/utils/encryption.service.js';
import { MailService } from '../../utils/mail.service.js';
import { EmailVerifyTokenDto } from './entities/dto/email-verify-token.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly elasticService: ElasticsearchService,
    private readonly encryptionService: EncryptService,
    private readonly mailService: MailService,
  ) {}

  async getById(id: string): Promise<Record<string, any>> {
    // const user = await this.userRepository.findOneBy({
    //   id: id,
    // });

    console.log('Searching with elastic search!');
    const user = await this.elasticService.search({
      index: 'users',
      body: {
        query: {
          match: {
            id: id,
          },
        },
      },
    });

    if (!user.hits.hits[0]._source) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, id),
        HttpStatus.BAD_REQUEST,
      );
    }

    const userEntity = plainToInstance(User, user.hits.hits[0]._source);

    return instanceToPlain(userEntity);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, id),
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(user, dto);

    const updatedUser = await this.userRepository.save(user);

    return {
      message: Strings.entityUpdated(Entities.User),
      user: instanceToPlain(updatedUser),
    };
  }

  async delete(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, id),
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedUser = await this.userRepository.delete({ id: id });
    if (deletedUser.affected > 0)
      return {
        message: Strings.entityDeleted(Entities.User),
      };
  }

  async sendEmailVerificationToken(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, id),
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = await this.encryptionService.encryptData(token, true);

    user.emailVerificationToken = hashedToken;

    const emailText = `Your email verification token - ${token}`;
    await this.mailService.sendEmail(user.email, emailText);

    console.log(token);
  }

  async verifyEmailVerificationToken(id: string, dto: EmailVerifyTokenDto) {
    const user = await this.userRepository.findOneBy({
      id: id,
      emailVerificationToken: (
        await this.encryptionService.encryptData(dto.token)
      ).toString(),
    });

    if (user.emailVerified == true) {
      throw new HttpException(
        Strings.emailAlreadyVerified,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user) {
      throw new HttpException(
        Strings.noEntityWithField(
          Entities.User,
          Fields.EmailVerificationToken,
          dto.token,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    user.emailVerified = true;

    return {
      message: Strings.emailVerifySuccess,
    };
  }
}
