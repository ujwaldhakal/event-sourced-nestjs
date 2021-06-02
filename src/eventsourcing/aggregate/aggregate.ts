export interface IAggregate {
  getStreamName(): string;
  getStreamVersion(): number;
  getUncommittedEvents(): IDomainEvents[];
  commit(): void;
}
