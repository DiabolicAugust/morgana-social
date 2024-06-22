import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity } from 'typeorm';
import { Person } from '../../../person/entities/person.entity.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Exclude, instanceToPlain } from 'class-transformer';

@Entity('user')
export abstract class User extends Person {
  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  resetPasswordExpires: Date;

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    User.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    const userPlain = this;
    const result = await User.elasticsearchService.index({
      index: 'users',
      id: this.id.toString(),
      body: userPlain,
    });
    console.log(result);
    if (result.result === 'created' || result.result === 'updated')
      console.log("Elastic search did it's job!");
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    await User.elasticsearchService.delete({
      index: 'users',
      id: this.id.toString(),
    });
  }
}
