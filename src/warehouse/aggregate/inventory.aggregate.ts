import { IAggregate } from 'eventsourcing/aggregate/aggregate';
import { ItemAdded } from 'warehouse/domain-events/ItemAddedEvent';
import { ItemUpdated } from 'warehouse/domain-events/ItemUpdatedEvent';
import { ItemTransferred } from 'warehouse/domain-events/ItemTransferredEvent';

export class Inventory implements IAggregate {
  public id: string;
  public name: string;
  public unitPrice: number;
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

  public apply(event, loadFromHistory = false) {
    if (event.constructor.name === 'ItemAdded') {
      this.onItemAdded(event);
    }

    if (event.constructor.name === 'ItemUpdated') {
      this.onItemUpdated(event);
    }

    if (event.constructor.name === 'ItemTransferred') {
      this.onItemTransferred(event);
    }

    if (!loadFromHistory) {
      this.events.push(event);
    }
  }

  public onItemAdded(event: ItemAdded) {
    this.name = event.getPayload().name;
    this.unitPrice = event.getPayload().unitPrice;
    this.currency = event.getPayload().currency;
    this.quantity = event.getPayload().quantity;
  }

  public onItemTransferred(event: ItemTransferred) {
    if (this.quantity < event.getPayload().quantity) {
      throw Error('Cannot transfer items than you have');
    }

    this.quantity = this.quantity - event.getPayload().quantity;
  }

  public onItemUpdated(event: ItemUpdated) {
    if (event.getPayload().name) {
      this.name = event.getPayload().name;
    }

    if (event.getPayload().unitPrice) {
      this.unitPrice = event.getPayload().unitPrice;
    }

    if (event.getPayload().currency) {
      this.currency = event.getPayload().currency;
    }
    if (event.getPayload().quantity) {
      this.quantity = event.getPayload().quantity;
    }
  }
}
