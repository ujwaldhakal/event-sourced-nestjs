import { Inject, Injectable, Provider } from '@nestjs/common';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import { EventSourcedAggregateStore } from 'eventsourcing/event-sourced-aggregate-store';
import { InventoryProjection } from 'warehouse/projections/inventory.projection';

@Injectable()
export class InventoryAggregateRepository {
  constructor(
    @Inject(EventSourcedAggregateStore)
    private readonly aggregateStore: EventSourcedAggregateStore, // private readonly projector: InventoryProjection,
  ) {}

  save(inventory): Promise<void> {
    return this.aggregateStore.save(inventory);
  }

  // find(aggregateId: string): Promise<Inventory | null> {
  //   return this.aggregateStore.findById(aggregateId);
  // }

  // async findOrFail(aggregateId: string): Promise<Inventory> {
  //   const inventory = await this.find(aggregateId);
  //
  //   if (!inventory) {
  //     throw new Error('');
  //   }
  //
  //   return inventory;
  // }
}

export const InventoryAggregateRepositoryProvider = {
  provide: 'InventoryAggregateRepository',
  useClass: InventoryAggregateRepository,
} as Provider;
