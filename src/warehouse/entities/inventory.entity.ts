import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('inventory')
export class InventoryEntity {
  constructor(props?: Partial<InventoryEntity>) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryColumn('uuid')
  readonly id: string;

  @Column('varchar', {
    length: 100,
  })
  readonly name: string;

  @Column('varchar', {
    length: 100,
  })
  readonly currency: string;

  @Column('integer')
  readonly unitPrice: number;

  @Column('integer')
  readonly quantity: number;
}
