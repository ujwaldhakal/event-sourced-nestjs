import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InventoryAggregateRepository } from 'warehouse/repositories/inventory-aggregate.repository';
import { Inject } from '@nestjs/common';
import { TransferItemCommand } from 'warehouse/commands/transfer-item.command';

@CommandHandler(TransferItemCommand)
export class TransferItemHandler
  implements ICommandHandler<TransferItemCommand> {
  constructor(
    @Inject(InventoryAggregateRepository)
    private repository: InventoryAggregateRepository,
  ) {}

  async execute(command: TransferItemCommand) {
    const inventory = await this.repository.findOrFail(command.id);

    inventory.transfer(command.quantity);

    await this.repository.save(inventory);
  }
}
