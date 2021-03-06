import { IAggregate } from 'eventsourcing/aggregate/aggregate';
import { ItemAdded } from 'warehouse/domain-events/ItemAddedEvent';
import { ItemUpdated } from 'warehouse/domain-events/ItemUpdatedEvent';
import { ItemTransferred } from 'warehouse/domain-events/ItemTransferredEvent';
import { InsufficientQuantityForTransfer } from 'warehouse/exceptions/insufficient-quantity-for-transfer.exception';

export class Inventory implements IAggregate {
  public id: string;
  public name: string;
  public unitPrice: number;
  public currency: string;
  public quantity: number;
  public version = 0;
  public events: IDomainEvents[] = [];

  setStreamVersion(version) {
    this.version = version;
  }

  public constructor(id: string) {
    this.id = id;
  }

  getStreamName(): string {
    return 'Inventory';
  }

  getStreamVersion(): number {
    return this.version;
  }

  public getUncommittedEvents(): IDomainEvents[] {
    return this.events;
  }

  public commit(): void {
    this.events = [];
  }

  public transfer(quantity: number) {
    if (this.quantity < quantity) {
      throw new InsufficientQuantityForTransfer(
        'Cannot transfer items than you have',
      );
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
