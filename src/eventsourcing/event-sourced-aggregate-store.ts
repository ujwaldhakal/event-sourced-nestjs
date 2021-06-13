import { Injectable, Type } from '@nestjs/common';
import { EventStore } from 'eventsourcing/event-store';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import {
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  START,
} from '@eventstore/db-client';
import { Kafka } from 'kafkajs';
import { Client } from '@eventstore/db-client/dist/Client';

@Injectable()
export class EventSourcedAggregateStore {
  private readonly client: Client;
  public constructor(protected readonly eventStore: EventStore) {
    this.client = EventStoreDBClient.connectionString(
      'esdb://172.20.0.4:2113?tls=false',
    );
  }

  public async streamExists(streamName: string): Promise<boolean> {
    try {
      await this.client.readStream(streamName, {
        fromRevision: START,
        direction: FORWARDS,
        maxCount: 10,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  public async save(aggregateRoot: Inventory) {
    const streamExists = await this.streamExists(aggregateRoot.getStreamName());
    const events = aggregateRoot
      .getUncommittedEvents()
      .map((event: IDomainEvents) => {
        return jsonEvent({
          data: event.getPayload(),
          type: event.getEventName(),
        });
      });

    await this.client.appendToStream(aggregateRoot.getStreamName(), events, {
      expectedRevision: streamExists ? 'stream_exists' : 'no_stream',
    });
    aggregateRoot.commit();
  }

  public async findById(streamName: string): Promise<any> {
    return this.client.readStream(streamName, {
      fromRevision: START,
      direction: FORWARDS,
      maxCount: 10,
    });
  }
}
