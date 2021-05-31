import { Inject, Injectable, Provider } from '@nestjs/common';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import { EventSourcedAggregateStore } from 'eventsourcing/event-sourced-aggregate-store';
import { InventoryProjection } from 'warehouse/projections/inventory.projection';
import { ItemAdded } from 'warehouse/domain-events/ItemAddedEvent';

@Injectable()
export class InventoryAggregateRepository {
  constructor(
    @Inject(EventSourcedAggregateStore)
    private readonly aggregateStore: EventSourcedAggregateStore, // private readonly projector: InventoryProjection,
  ) {}

  save(inventory): Promise<void> {
    return this.aggregateStore.save(inventory);
  }

  async findOrFail(aggregateId: string): Promise<Inventory> {
    const events = await this.aggregateStore.findById(aggregateId, 'Inventory');

    const inventory = new Inventory(aggregateId);
    if (!events) {
      throw new Error('');
    }

    events.forEach((event) => {
      if (event.eventName === 'ItemAdded') {
        inventory.apply(
          new ItemAdded({ ...event.payload, inventoryId: aggregateId }),
          true,
        );
      }
    });

    return inventory;
  }
}

export const InventoryAggregateRepositoryProvider = {
  provide: 'InventoryAggregateRepository',
  useClass: InventoryAggregateRepository,
} as Provider;
