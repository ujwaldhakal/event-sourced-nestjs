import { BaseEvent } from 'warehouse/domain-events/base-event';

export class ItemUpdated {
  static prepare(
    aggregateId: string,
    payload: {
      name: string;
      price: number;
      currency: string;
      quantity: number;
    },
  ) {
    const aggregateVersion = 1;
    // return new ItemUpdatedEvent({
    //   aggregateId,
    //   payload,
    //   aggregateVersion,
    // });
  }
}
