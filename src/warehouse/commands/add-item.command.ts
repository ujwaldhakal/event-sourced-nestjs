export class AddItemCommand {
  constructor(
    public id: string,
    public name: string,
    public currency: string,
    public unitPrice: number,
    public quantity: number,
  ) {}
}
