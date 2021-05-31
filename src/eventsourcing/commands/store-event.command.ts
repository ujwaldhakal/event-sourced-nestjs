export class StoreEventCommand {
  constructor(
    public eventName: string,
    public aggregateId: string,
    public aggregateType: string,
    public payload: Record<any, any>,
  ) {}
}
