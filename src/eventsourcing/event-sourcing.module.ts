import { Module } from '@nestjs/common';
import { StoreEventHandler } from 'eventsourcing/commands/handlers/store-event.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'eventsourcing/entities/event-store.entity';
import { CoreModule } from 'core/core.module';
import { EventSourcedAggregateStore } from 'eventsourcing/event-sourced-aggregate-store';
import { EventStore } from 'eventsourcing/event-store';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, CoreModule, TypeOrmModule.forFeature([EventEntity])],
  providers: [StoreEventHandler, EventSourcedAggregateStore, EventStore],
  exports: [EventSourcedAggregateStore],
})
export class EventSourcingModule {}
