export class ItemAdded implements IDomainEvents {
  public inventoryId: string;
  public name: string;
  public unitPrice: number;
  public currency: string;
  public quantity: number;

  public constructor(opts: {
    inventoryId: string;
    name: string;
    unitPrice: number;
    currency: string;
    quantity: number;
  }) {
    this.inventoryId = opts.inventoryId;
    this.name = opts.name;
    this.unitPrice = opts.unitPrice;
    this.currency = opts.currency;
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
      name: this.name,
      unitPrice: this.unitPrice,
      currency: this.currency,
      quantity: this.quantity,
    };
  }

  getEventName() {
    return 'ItemAdded';
  }
}
