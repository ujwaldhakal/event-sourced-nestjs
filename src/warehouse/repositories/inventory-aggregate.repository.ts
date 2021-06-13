import { Inject, Injectable, Provider } from '@nestjs/common';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import { EventSourcedAggregateStore } from 'eventsourcing/event-sourced-aggregate-store';
import { InventoryProjection } from 'warehouse/projections/inventory.projection';
import { ItemAdded } from 'warehouse/domain-events/ItemAddedEvent';
import { ItemUpdated } from 'warehouse/domain-events/ItemUpdatedEvent';
import { ItemTransferred } from 'warehouse/domain-events/ItemTransferredEvent';

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
    const inventory = new Inventory(aggregateId);

    const events = await this.aggregateStore.findById(
      inventory.getStreamName(),
    );

    if (!events) {
      throw new Error('');
    }

    events.forEach((event) => {
      if (event.event.type === 'ItemAdded') {
        inventory.apply(
          new ItemAdded({ ...event.event.data, inventoryId: aggregateId }),
          true,
        );
      }

      if (event.event.type === 'ItemUpdated') {
        inventory.apply(
          new ItemUpdated({ ...event.event.data, inventoryId: aggregateId }),
          true,
        );
      }

      if (event.event.type === 'ItemTransferred') {
        inventory.apply(
          new ItemTransferred({
            ...event.event.data,
            inventoryId: aggregateId,
          }),
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
