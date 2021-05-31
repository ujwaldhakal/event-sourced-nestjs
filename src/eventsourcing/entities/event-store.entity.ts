import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event')
export class EventEntity {
  constructor(props?: Partial<EventEntity>) {
    if (props) {
      Object.assign(this, props);
    }
  }
  @PrimaryGeneratedColumn('uuid')
  readonly id: number;

  @Column('varchar', {
    length: 100,
  })
  readonly eventName: string;

  @Column('jsonb')
  readonly payload: string;

  @Column('varchar')
  readonly aggregateType: string;

  @Column('smallint')
  readonly aggregateVersion: number;

  @Column('uuid')
  readonly aggregateId: string;
}
