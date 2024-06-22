import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './person/authorization/authorization.module';
import { UserModule } from './person/user/user.module';
import { GlobalElasticsearchModule } from './elasticsearch/global-elasticsearch.module.js';

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
    AuthorizationModule,
    UserModule,
    GlobalElasticsearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
