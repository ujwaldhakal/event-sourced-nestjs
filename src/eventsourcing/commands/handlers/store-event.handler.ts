import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventCommand } from 'eventsourcing/commands/store-event.command';

@CommandHandler(StoreEventCommand)
export class StoreEventHandler implements ICommandHandler<StoreEventCommand> {
  // constructor(private repository: HeroRepository) {}

  async execute(command: StoreEventCommand) {}
}
