import { QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EventEntity } from 'eventsourcing/entities/event-store.entity';
import { InventoryEntity } from 'warehouse/entities/inventory.entity';
import { Iprojection } from 'eventsourcing/projections/Iprojection';
import { QueryRunnerFactory } from 'core/query-runner.factory';

@Injectable()
export class InventoryProjection implements Iprojection {
  public constructor(public queryRunner: QueryRunnerFactory) {}

  async project(events: readonly IDomainEvents[]): Promise<any> {
    await this.queryRunner.transaction(async (queryRunner) => {
      for (const event of events) {
        const handler = this[`when${event.getEventName()}`];
        await (handler && handler(event, queryRunner));
      }
    });
  }

  whenItemAdded(event, queryRunner) {
    queryRunner.manager.save(
      new InventoryEntity({
        id: event.getAggregateId(),
        unitPrice: event.getPayload().unitPrice,
        currency: event.getPayload().currency,
        name: event.getPayload().name,
        quantity: event.getPayload().quantity,
      }),
    );
  }

  async whenItemUpdated(event: IDomainEvents, queryRunner) {
    return await queryRunner.manager
      .createQueryBuilder(queryRunner)
      .update(InventoryEntity)
      .set(event.getPayload())
      .where('id = :id', { id: event.getAggregateId() })

      .execute();
  }
}
