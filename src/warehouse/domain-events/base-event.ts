import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEvent {
  public abstract get aggregateId(): string;
  public abstract get aggregateType(): string;
  public abstract get eventName(): string;
  public abstract get payload(): any;
}
