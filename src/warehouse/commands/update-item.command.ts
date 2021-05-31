export class UpdateItemCommand {
  constructor(
    public id: string,
    public data: {
      name?: string;
      currency?: string;
      unitPrice?: number;
      quantity?: number;
    },
  ) {}
}
