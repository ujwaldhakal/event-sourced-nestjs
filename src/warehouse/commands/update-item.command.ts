export class UpdateItemCommand {
  constructor(
    public id: string,
    public data: { name?: string; currency?: string; unit_price?: number },
  ) {}
}
