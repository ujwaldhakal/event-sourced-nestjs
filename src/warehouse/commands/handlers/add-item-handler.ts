import { AddItemCommand } from 'warehouse/commands/add-item.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InventoryAggregateRepository } from 'warehouse/repositories/inventory-aggregate.repository';
import { Inventory } from 'warehouse/aggregate/inventory.aggregate';
import { v4 as uuidv4 } from 'uuid';
import { Inject } from '@nestjs/common';
import { ItemAdded } from 'warehouse/domain-events/ItemAddedEvent';

@CommandHandler(AddItemCommand)
export class AddItemHandler implements ICommandHandler<AddItemCommand> {
  constructor(
    @Inject(InventoryAggregateRepository)
    private repository: InventoryAggregateRepository,
  ) {}

  async execute(command: AddItemCommand) {
    const inventory = new Inventory(command.id);

    inventory.apply(
      new ItemAdded({
        inventoryId: inventory.id,
        price: command.unitPrice,
        currency: command.currency,
        quantity: command.quantity,
        name: command.name,
      }),
    );

    await this.repository.save(inventory);
  }
}
