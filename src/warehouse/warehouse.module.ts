import { Module } from '@nestjs/common';
import { WarehouseController } from 'warehouse/http/controllers/warehouse.controller';
import { AddItemHandler } from 'warehouse/commands/handlers/add-item-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InventoryAggregateRepositoryProvider } from 'warehouse/repositories/inventory-aggregate.repository';
import { EventSourcingModule } from 'eventsourcing/event-sourcing.module';
import { InventoryProjection } from 'warehouse/projections/inventory.projection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from 'warehouse/entities/inventory.entity';
import { UpdateItemHandler } from 'warehouse/commands/handlers/update-item-handler';
import { WarehouseEvents } from 'warehouse/sagas/warehouse-events';
import { CoreModule } from 'core/core.module';
import { TransferItemHandler } from 'warehouse/commands/handlers/transfer-item-handler';

@Module({
  imports: [
    CoreModule,
    CqrsModule,
    EventSourcingModule,
    TypeOrmModule.forFeature([InventoryEntity]),
  ],
  controllers: [WarehouseController],
  providers: [
    AddItemHandler,
    UpdateItemHandler,
    TransferItemHandler,
    InventoryAggregateRepositoryProvider,
    InventoryProjection,
    WarehouseEvents,
  ],
})
export class WarehouseModule {}
