import { AggregateRoot, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Injectable, Type } from '@nestjs/common';
import { EventStore } from 'eventsourcing/event-store';
import { EventEntity } from 'eventsourcing/entities/event-store.entity';
import { v4 as uuidv4 } from 'uuid';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import { EventsAdded } from 'eventsourcing/events/events-added';

@Injectable()
export class EventSourcedAggregateStore {
  public constructor(
    protected readonly eventStore: EventStore,
    protected readonly eventBus: EventBus,
  ) {}

  public async save(aggregateRoot: Inventory) {
    const events = aggregateRoot
      .getUncommittedEvents()
      .map((event: IDomainEvents) => {
        return new EventEntity({
          id: uuidv4(),
          aggregateId: event.getAggregateId(),
          payload: event.getPayload(),
          aggregateType: aggregateRoot.getStreamName(),
          aggregateVersion: aggregateRoot.getStreamVersion(),
          eventName: event.getEventName(),
        });
      });

    await this.eventStore.save(events);

    this.eventBus.publish(
      new EventsAdded(aggregateRoot, aggregateRoot.getUncommittedEvents()),
    );

    aggregateRoot.commit();
  }

  public async findById(
    aggregateId: string,
    aggregateName: string,
  ): Promise<any> {
    return await this.eventStore.loadEventsForAggregate(
      aggregateName,
      aggregateId,
    );
  }
}
