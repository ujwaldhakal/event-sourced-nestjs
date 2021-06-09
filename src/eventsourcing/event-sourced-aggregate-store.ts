import { AggregateRoot, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Injectable, Type } from '@nestjs/common';
import { EventStore } from 'eventsourcing/event-store';
import { EventEntity } from 'eventsourcing/entities/event-store.entity';
import { v4 as uuidv4 } from 'uuid';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import { EventsAdded } from 'eventsourcing/events/events-added';
import {
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  START,
} from '@eventstore/db-client';

const client = EventStoreDBClient.connectionString(
  'esdb://172.20.0.3:2113?tls=false',
);

@Injectable()
export class EventSourcedAggregateStore {
  public constructor(
    protected readonly eventStore: EventStore,
    protected readonly eventBus: EventBus,
  ) {}

  public async getAggregateLatestVersion(
    aggregateId: string,
    aggregateType: string,
  ) {
    return this.eventStore.getSingleLatestAggregate(aggregateId, aggregateType);
  }

  public async save(aggregateRoot: Inventory) {
    const latestVersion = await this.eventStore.getSingleLatestAggregate(
      aggregateRoot.id,
      aggregateRoot.getStreamName(),
    );

    if (latestVersion) {
      aggregateRoot.setStreamVersion(latestVersion.aggregateVersion);
    }

    const events = aggregateRoot
      .getUncommittedEvents()
      .map((event: IDomainEvents) => {
        return jsonEvent({
          data: event.getPayload(),
          type: event.getEventName(),
        });
      });

    console.log(latestVersion);

    let existingStream = [];
    try {
      existingStream = await client.readStream(aggregateRoot.getStreamName(), {
        fromRevision: START,
        direction: FORWARDS,
        maxCount: 10,
      });
    } catch (e) {
      existingStream = [];
      // console.log('not existing', e);
    }

    await client.appendToStream(aggregateRoot.getStreamName(), events, {
      expectedRevision:
        existingStream.length > 0 ? 'stream_exists' : 'no_stream',
    });
    aggregateRoot.commit();
  }

  public async findById(
    aggregateId: string,
    aggregateName: string,
  ): Promise<any> {
    return client.readStream(`inventory-${aggregateId}`, {
      fromRevision: START,
      direction: FORWARDS,
      maxCount: 10,
    });
  }
}
