import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InventoryAggregateRepository } from 'warehouse/repositories/inventory-aggregate.repository';
import { Inject } from '@nestjs/common';
import { UpdateItemCommand } from 'warehouse/commands/update-item.command';
import { ItemUpdated } from 'warehouse/domain-events/ItemUpdatedEvent';

@CommandHandler(UpdateItemCommand)
export class UpdateItemHandler implements ICommandHandler<UpdateItemCommand> {
  constructor(
    @Inject(InventoryAggregateRepository)
    private repository: InventoryAggregateRepository,
  ) {}

  async execute(command: UpdateItemCommand) {
    const inventory = await this.repository.findOrFail(command.id);

    inventory.apply(
      new ItemUpdated({ ...command.data, inventoryId: command.id }),
    );

    await this.repository.save(inventory);
  }
}
