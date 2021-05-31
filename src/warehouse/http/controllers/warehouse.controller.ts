import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddItemCommand } from 'warehouse/commands/add-item.command';
import { UpdateItemCommand } from 'warehouse/commands/update-item.command';

@Controller('warehouse')
export class WarehouseController {
  constructor(public readonly commandBus: CommandBus) {}

  @Post('items')
  async addInventories(@Body() body: any): Promise<void> {
    await this.commandBus.execute(
      new AddItemCommand(
        body.id,
        body.name,
        body.currency,
        body.unitPrice,
        body.quantity,
      ),
    );
  }

  @Put('items')
  async updateItem(): Promise<void> {
    await this.commandBus.execute(
      new UpdateItemCommand('6145ae96-dbb9-484a-a1b9-7823fe2f2a24', {
        unit_price: 300,
      }),
    );
  }
}