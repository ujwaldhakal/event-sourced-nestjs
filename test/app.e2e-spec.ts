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
import { classToPlain, plainToClass } from 'class-transformer';

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

  function createItem(payload) {
    return request(app.getHttpServer())
      .post('/warehouse/items')
      .send(payload)
      .expect(201);
  }

  it('(POST) /warehouse/item', async () => {
    const id = uuidv4();
    const payload = {
      id: id,
      name: 'computer',
      currency: 'npr',
      unitPrice: 100,
      quantity: 5,
    };
    await createItem(payload);
    await promisify(setTimeout)(100);
    const inventory = await inventoryRepository.find({ id: id });
    console.log(inventory);
    expect(classToPlain(inventory[0])).toMatchObject(payload);
  });

  it('/warehouse/items/:id (PUT) should update the item attributes', async () => {
    const id = uuidv4();
    const payload = {
      id: id,
      name: 'computer',
      currency: 'npr',
      unitPrice: 100,
      quantity: 5,
    };
    await createItem(payload);
    await promisify(setTimeout)(100);

    await request(app.getHttpServer())
      .put(`/warehouse/items/${id}`)
      .send({ unitPrice: 50 })
      .expect(200);
    await promisify(setTimeout)(100);

    const inventory = await inventoryRepository.find({ id: id });
    expect(inventory).toHaveLength(1);
    expect(classToPlain(inventory[0])).toMatchObject({
      unitPrice: 50,
    });
  });

  it.only('/ (PUT) should transfer the item and reduce quantity at hands', async () => {
    const id = uuidv4();
    const payload = {
      id: id,
      name: 'computer',
      currency: 'npr',
      unitPrice: 100,
      quantity: 50,
    };
    await createItem(payload);
    await promisify(setTimeout)(5);

    await request(app.getHttpServer())
      .put(`/warehouse/items/${id}`)
      .send({ quantity: 45 })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/warehouse/items/transferred/${id}`)
      .send({ quantity: 5 })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/warehouse/items/transferred/${id}`)
      .send({ quantity: 10 })
      .expect(200);

    await request(app.getHttpServer())
      .put(`/warehouse/items/transferred/${id}`)
      .send({ quantity: 20 })
      .expect(200);
    await promisify(setTimeout)(5);

    const inventory = await inventoryRepository.find({ id: id });
    expect(inventory).toHaveLength(1);
    expect(inventory[0].quantity).toEqual(10);
  });

  afterAll(async () => {
    await Promise.all([
      eventRepository.delete({}),
      inventoryRepository.delete({}),
    ]);
    await app.close();
  });
});
