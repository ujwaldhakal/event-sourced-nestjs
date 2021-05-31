import { IAggregate } from 'eventsourcing/aggregate/aggregate';
import { ItemAdded } from 'warehouse/domain-events/ItemAddedEvent';

export class Inventory implements IAggregate {
  public id: string;
  public name: string;
  public unit_price: number;
  public currency: string;
  public quantity: number;
  public version: number;
  public events: IDomainEvents[] = [];

  public constructor(id: string) {
    this.id = id;
  }

  getStreamName(): string {
    return 'Inventory';
  }

  getStreamVersion(): number {
    return 1;
  }

  public getUncommittedEvents() {
    return this.events;
  }

  public apply(event) {
    if (event.constructor.name === 'ItemAdded') {
      this.onItemAdded(event);
    }
    this.events.push(event);
  }

  public onItemAdded(event: ItemAdded) {
    this.name = event.getPayload().name;
    this.unit_price = event.getPayload().unitPrice;
    this.currency = event.getPayload().currency;
    this.quantity = event.getPayload().quantity;
  }
}
