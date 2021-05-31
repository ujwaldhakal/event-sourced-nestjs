export class ItemTransferred implements IDomainEvents {
  public inventoryId: string;
  public quantity: number;

  public constructor(opts: { inventoryId: string; quantity: number }) {
    this.inventoryId = opts.inventoryId;
    this.quantity = opts.quantity;
  }

  getAggregateId() {
    return this.inventoryId;
  }

  getAggregateType() {
    return 'Inventory';
  }

  getPayload() {
    return {
      quantity: this.quantity,
    };
  }

  getEventName() {
    return 'ItemTransferred';
  }
}
