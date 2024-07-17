import { BaseEntity } from './person/entities/base-entity.class.js';

export abstract class ParentServiceClass<T extends BaseEntity> {
  abstract get(id: string): Promise<T>;
}
