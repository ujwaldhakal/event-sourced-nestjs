export class ItemUpdated implements IDomainEvents {
  public name: string;
  public inventoryId: string;
  public unitPrice: number;
  public currency: string;
  public quantity: number;

  public constructor(opts: {
    inventoryId: string;
    name?: string;
    unitPrice?: number;
    currency?: string;
    quantity?: number;
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
      ...(this.name && { name: this.name }),
      ...(this.unitPrice && { unitPrice: this.unitPrice }),
      ...(this.currency && { currency: this.currency }),
      ...(this.quantity && { quantity: this.quantity }),
    };
  }

  getEventName() {
    return 'ItemUpdated';
  }
}
