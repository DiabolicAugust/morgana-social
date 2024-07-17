import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { ParentServiceClass } from '../../../parent.class.js';
import { BaseEntity } from '../../../person/entities/base-entity.class.js';
import { Payload } from '../payload.dto.js';

@Injectable()
export class IsAuthorGuard<T extends BaseEntity> implements CanActivate {
  constructor(
    @Inject('EntityService') private readonly service: ParentServiceClass<T>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: Payload = request['user'];
    const entityId = request.params.id;

    const entity = await this.service.get(entityId);

    if (!entity) {
      throw new ForbiddenException('Entity not found');
    }

    if (entity['author'].id !== user.id) {
      throw new ForbiddenException('You are not the author of this entity');
    }

    if (entity['author'].id == user.id)
      console.log('Requestor is an author of the entity');

    return true;
  }
}
