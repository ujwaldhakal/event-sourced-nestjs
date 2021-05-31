import { IAggregate } from 'eventsourcing/aggregate/aggregate';

export class EventsAdded {
  constructor(public aggregate: IAggregate, public events: IDomainEvents[]) {}
}
