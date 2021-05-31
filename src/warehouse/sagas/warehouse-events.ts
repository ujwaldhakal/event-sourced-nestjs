import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { EventsAdded } from 'eventsourcing/events/events-added';
import { map } from 'rxjs/operators';
import { InventoryProjection } from 'warehouse/projections/inventory.projection';

@Injectable()
export class WarehouseEvents {
  constructor(public projection: InventoryProjection) {}
  @Saga()
  wareHouseEvents = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(EventsAdded),
      map((event) => {
        if (event.aggregate.getStreamName() === 'Inventory') {
          this.projection.project(event.events, event.aggregate);
        }
      }),
    );
  };
}
