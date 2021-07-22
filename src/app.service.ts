import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventStoreDBClient, STREAM_NAME } from '@eventstore/db-client';
import { Readable } from 'stream';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit(): any {
    const client = EventStoreDBClient.connectionString(
      'esdb://eventstore.db:2113?tls=false',
    );

    // const prefixes = ['inventory-'];
    // const filter = { filterOn: STREAM_NAME, prefixes };
    const subscription = client
      .subscribeToStream('$ce-inventory', { resolveLinkTos: true })
      .on('data', (event) => {
        // const stream = Readable.from(event.event.data.toString());
        // console.log('should get one at a time', event.event);
        console.log('should get one at a time', event.event);
      });

    console.log('register projection here');
    console.log('register projection here');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
