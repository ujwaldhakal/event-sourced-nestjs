import { QueryRunner, Repository } from 'typeorm';
import { EventEntity } from 'eventsourcing/entities/event-store.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunnerFactory } from 'core/query-runner.factory';

@Injectable()
export class EventStore {
  public constructor(
    @InjectRepository(EventEntity)
    protected readonly eventRepository: Repository<EventEntity>,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  public async save(events: readonly EventEntity[], queryRunner?: QueryRunner) {
    await this.eventRepository
      .createQueryBuilder(undefined, queryRunner)
      .insert()
      .values(events.slice())
      .execute();
  }

  async loadEventsForAggregate(
    aggregateType: string,
    aggregateId: string,
    from = 1,
    count?: number,
  ) {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .where('event.aggregateVersion >= :version', { version: from })
      .andWhere('event.aggregateType = :aggregateType', { aggregateType })
      .andWhere('event.aggregateId = :aggregateId::uuid', { aggregateId })
      .orderBy('event.aggregateVersion', 'ASC');

    if (count) {
      query.take(count);
    }

    return query.getMany();
  }

  async loadEvents(
    filter: {
      readonly aggregateType?: string | readonly string[];
      readonly aggregateId?: string;
      readonly metadata?: any;
      readonly brandId?: string;
    },
    from = 1,
    count?: number,
  ) {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .where('event.counter >= :from', { from: from })
      .orderBy('counter', 'ASC');

    if (filter.aggregateType) {
      query.andWhere('event.aggregateType IN (:...aggregateTypes)', {
        aggregateTypes: Array.isArray(filter.aggregateType)
          ? filter.aggregateType
          : [filter.aggregateType],
      });
    }

    if (filter.aggregateId) {
      query.andWhere('event.aggregateId = :aggregateId::uuid', {
        aggregateId: filter.aggregateId,
      });
    }

    if (filter.metadata) {
      query.andWhere('event.metadata @> :metadata::jsonb', {
        metadata: filter.metadata,
      });
    }

    if (filter.brandId) {
      query.andWhere("(event.metadata->>'brandId')::uuid = :brandId::uuid", {
        brandId: filter.brandId,
      });
    }

    if (count) {
      query.take(count);
    }

    return query.getMany();
  }
}
