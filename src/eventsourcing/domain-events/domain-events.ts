interface IDomainEvents {
  getAggregateId(): string;
  getAggregateType(): string;
  getEventName(): string;
  getPayload(): any;
}
