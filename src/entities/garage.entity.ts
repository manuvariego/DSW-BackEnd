import { ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection, Property, Rel } from '@mikro-orm/core';
import { Location } from './location.entity.js';

@Entity()
export class Garage {
  @PrimaryKey({ type: 'number' })
  cuit!: number;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  address!: string;

  @Property({ type: 'string' })
  phone_number!: string;

  @Property({ type: 'string' })
  email!: string;

  @Property({ type: 'number' })
  priceHour!: number;

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>


}
