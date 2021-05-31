import { QueryRunner } from 'typeorm';
import { IAggregate } from 'eventsourcing/aggregate/aggregate';

export interface Iprojection {
  project(events: readonly IDomainEvents[], aggregate: IAggregate);
}
