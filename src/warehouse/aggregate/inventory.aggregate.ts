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

  public getUncommittedEvents(): IDomainEvents[] {
    return this.events;
  }

  public commit(): void {
    this.events = [];
  }

  public transfer(quantity: number) {
    if (this.quantity < quantity) {
      throw Error('Cannot transfer items than you have');
    }

    this.apply(
      new ItemTransferred({
        quantity: quantity,
        inventoryId: this.id,
      }),
    );
  }

  public update(data) {
    this.apply(new ItemUpdated({ ...data, inventoryId: this.id }));
  }

  public addItem(
    price: number,
    currency: string,
    quantity: number,
    name: string,
  ): void {
    this.apply(
      new ItemAdded({
        inventoryId: this.id,
        unitPrice: price,
        currency: currency,
        quantity: quantity,
        name: name,
      }),
    );
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
