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

  async whenItemUpdatedEvent(event, queryRunner) {
    const inventory = await queryRunner.manager.find(InventoryEntity, {
      id: event.aggregateId,
    });

    return await queryRunner.manager
      .createQueryBuilder(queryRunner)
      // .from(InventoryEntity, 'inventory')
      .update(InventoryEntity)
      .set({
        // ...('unit_price' in event.payload && {
        unit_price: event.payload.unit_price,
        // }),
      })
      .where('id = :id', { id: event.aggregateId })
      // .where({ id: event.aggregateId })

      .execute();
  }
}
