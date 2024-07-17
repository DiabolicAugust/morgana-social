import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './person/authorization/authorization.module';
import { UserModule } from './person/user/user.module';
import { GlobalElasticsearchModule } from './elasticsearch/global-elasticsearch.module.js';
import { PostModule } from './post/post/post.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LikeModule } from './post/like/like.module';
import { CommentModule } from './post/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      entities: [process.env.ENTITIES],
      synchronize: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/api/uploads',
    }),
    AuthorizationModule,
    UserModule,
    GlobalElasticsearchModule,
    PostModule,
    LikeModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
