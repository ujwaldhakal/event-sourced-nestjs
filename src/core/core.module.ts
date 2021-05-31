import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryRunnerFactory } from 'core/query-runner.factory';

@Module({
  imports: [CqrsModule],
  providers: [QueryRunnerFactory],
  exports: [QueryRunnerFactory],
})
export class CoreModule {}
