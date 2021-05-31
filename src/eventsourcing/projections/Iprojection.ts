import { QueryRunner } from 'typeorm';

export interface Iprojection {
  project(events: readonly IDomainEvents[], queryRunner: QueryRunner);
}
