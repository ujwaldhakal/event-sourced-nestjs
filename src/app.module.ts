import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventSourcingModule } from 'eventsourcing/event-sourcing.module';
import { WarehouseModule } from 'warehouse/warehouse.module';
import dbConfig from 'config/database';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

@Module({
  imports: [
    EventSourcingModule,
    WarehouseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      password: dbConfig.password,
      username: dbConfig.username,
      synchronize: dbConfig.synchronize,
      autoLoadEntities: dbConfig.autoLoadEntities,
    } as TypeOrmModuleOptions & PostgresConnectionCredentialsOptions & { readonly password: string }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
