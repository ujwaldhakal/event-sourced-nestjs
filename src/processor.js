const { EventStoreDBClient } = require('@eventstore/db-client');

const client = EventStoreDBClient.connectionString(
  'esdb://eventstore.db:2113?tls=false',
);

// const prefixes = ['inventory-'];
// const filter = { filterOn: STREAM_NAME, prefixes };
const subscription = client.subscribeToAll().on('data', (event) => {
  // const stream = Readable.from(event.event.data.toString());
  if (event) console.log('should get one at a time', event.event);
  // console.log('event', Buffer.from(event.event.data).toString('base64'));
});
console.log('register projection here');
