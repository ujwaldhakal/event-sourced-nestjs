import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { EventEntity } from 'eventsourcing/entities/event-store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryEntity } from 'warehouse/entities/inventory.entity';
import { classToPlain } from 'class-transformer';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let eventRepository: Repository<EventEntity>;
  let inventoryRepository: Repository<InventoryEntity>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    eventRepository = app.get(getRepositoryToken(EventEntity));
    inventoryRepository = app.get(getRepositoryToken(InventoryEntity));
    await app.init();
  });

  it.only('(POST) /warehouse/item', async () => {
    const id = uuidv4();
    const payload = {
      id: id,
      name: 'computer',
      currency: 'npr',
      unitPrice: 100,
      quantity: 5,
    };
    await request(app.getHttpServer())
      .post('/warehouse/items')
      .send(payload)
      .expect(201);

    await promisify(setTimeout)(100);
    const inventory = await inventoryRepository.find({ id: id });
    console.log(inventory);
    expect(classToPlain(inventory[0])).toMatchObject(payload);
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .post('/warehouse/items/arrived')
      .expect(201);

    await promisify(setTimeout)(100);
  });

  afterAll(async () => {
    await Promise.all([
      eventRepository.delete({}),
      inventoryRepository.delete({}),
    ]);
    await app.close();
  });
});
