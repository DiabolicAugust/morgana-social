import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { CreateUserDto } from '../user/entities/dto/create-user.dto.js';
import { EncryptService } from '../authorization/utils/encryption.service.js';
import { instanceToPlain } from 'class-transformer';
import { LoginUserDto } from '../user/entities/dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';
import { Strings } from '../../data/strings.js';
import { Entities, Fields } from '../../data/enums.js';
import { ResetPasswordDto } from '../user/entities/dto/reset-password.dto.js';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { MailService } from '../../utils/mail.service.js';
import { ValidateTokenDto } from '../user/entities/dto/validate-token.dto.js';
import { Payload } from '../authorization/payload.dto.js';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration(dto: CreateUserDto) {
    const password = await this.encryptionService.encryptData(dto.password);
    dto.password = password;
    const user = this.userRepository.create(dto);
    const savedUser = await this.userRepository.save(user);

    if (!savedUser)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );

    return instanceToPlain(savedUser);
  }

  async login(dto: LoginUserDto) {
    if (dto.email) {
      const user = await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!user)
        throw new HttpException(
          Strings.noEntityWithField(Entities.User, Fields.Email, dto.email),
          HttpStatus.BAD_REQUEST,
        );

      const dehashedPassword = await this.encryptionService.decryptData(
        user.password,
      );

      if (dehashedPassword != dto.password)
        throw new HttpException(
          Strings.wrongField(Fields.Password),
          HttpStatus.BAD_REQUEST,
        );

      const payload: Payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      return {
        token: await this.jwtService.signAsync(payload),
      };
    }
    if (dto.username) {
      const user = await this.userRepository.findOne({
        where: {
          username: dto.username,
        },
      });

      if (!user)
        throw new HttpException(
          Strings.noEntityWithField(
            Entities.User,
            Fields.Username,
            dto.username,
          ),
          HttpStatus.BAD_REQUEST,
        );

      console.log(user);

      const dehashedPassword = await this.encryptionService.decryptData(
        user.password,
      );

      if (dehashedPassword != dto.password)
        throw new HttpException(
          Strings.wrongField(Fields.Password),
          HttpStatus.BAD_REQUEST,
        );

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      return {
        token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    let user;
    if (dto.email) {
      user = await this.userRepository.findOne({ where: { email: dto.email } });
      if (!user)
        throw new HttpException(
          Strings.noEntityWithField(Entities.User, Fields.Email, dto.email),
          HttpStatus.BAD_REQUEST,
        );
    }
    if (dto.username) {
      user = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (!user)
        throw new HttpException(
          Strings.noEntityWithField(
            Entities.User,
            Fields.Username,
            dto.username,
          ),
          HttpStatus.BAD_REQUEST,
        );
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = await this.encryptionService.encryptData(token, true);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await this.userRepository.save(user);

    await this.mailService.sendEmail(
      user.email,
      `Your password reset token - ${token}`,
    );
    console.log(user.email, token);
    return {
      message: 'Token was sent to your email',
    };
  }

  async validateToken(dto: ValidateTokenDto) {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: await this.encryptionService.encryptData(
          dto.token,
          true,
        ),
        // resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = await this.encryptionService.encryptData(dto.newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);
    console.log(user);
    return {
      message: 'Password was chnged successfully!',
    };
  }
}
