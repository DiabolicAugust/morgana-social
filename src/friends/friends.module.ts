import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './entity/friends.entity.js';
import { User } from '../person/user/entities/user.entity.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService],
  imports: [TypeOrmModule.forFeature([User, Friends])],
})
export class FriendsModule {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    Friends.setElasticsearchService(this.elasticsearchService);
  }
}
