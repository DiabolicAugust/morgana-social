import { Module, OnModuleInit } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MailService } from '../../utils/mail.service.js';
import { EncryptService } from '../authorization/utils/encryption.service.js';

@Module({
  controllers: [UserController],
  providers: [UserService, MailService, EncryptService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    User.setElasticsearchService(this.elasticsearchService);
  }
}
