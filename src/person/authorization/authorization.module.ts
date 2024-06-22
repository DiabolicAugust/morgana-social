import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { RegistrationService } from '../registration/registration.service';
import { EncryptService } from './utils/encryption.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../../utils/mail.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { createMailerConfig } from '../../utils/mailer.config.js';

@Module({
  controllers: [AuthorizationController],
  providers: [RegistrationService, EncryptService, MailService],
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async () => await createMailerConfig(),
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
})
export class AuthorizationModule {}
