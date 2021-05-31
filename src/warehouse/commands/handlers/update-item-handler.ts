import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InventoryAggregateRepository } from 'warehouse/repositories/inventory-aggregate.repository';
import { Inject } from '@nestjs/common';
import { UpdateItemCommand } from 'warehouse/commands/update-item.command';

@CommandHandler(UpdateItemCommand)
export class UpdateItemHandler implements ICommandHandler<UpdateItemCommand> {
  constructor(
    @Inject(InventoryAggregateRepository)
    private repository: InventoryAggregateRepository,
  ) {}

  async execute(command: UpdateItemCommand) {
    // const aggregate = new InventoryAggregate();
    // const inventory = await this.repository.findOrFail(command.id);
    //
    // console.log(inventory);
    // console.log('got inventory', inventory);
    // const inventoryAggregate = inventory.updateItem(command.id, command.data);
    //
    // await this.repository.save(inventoryAggregate);
    // console.log('reached upto here');
  }
}
