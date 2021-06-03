import { Body, Controller, Param, Post, Put, UseFilters } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddItemCommand } from 'warehouse/commands/add-item.command';
import { UpdateItemCommand } from 'warehouse/commands/update-item.command';
import { TransferItemCommand } from 'warehouse/commands/transfer-item.command';
import { TransferExceptionFilter } from 'warehouse/exception-filters/transfer-exception-filter';

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

  @Put('items/:id')
  async updateItem(@Body() body: any, @Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new UpdateItemCommand(id, { ...body }));
  }

  @UseFilters(TransferExceptionFilter)
  @Put('items/transferred/:id')
  async itemTransferred(
    @Body() body: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.commandBus.execute(new TransferItemCommand(id, body.quantity));
  }
}
