import { ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection, Property, Rel } from '@mikro-orm/core';
import { Location } from './location.entity.js';

@Entity()
export class Garage {
  @PrimaryKey({})
  cuit!: number;

  @Property({})
  name!: string;

  @Property({})
  address!: string;

  @Property({})
  phone_number!: string;

  @Property({})
  email!: string;

  @Property({})
  priceHour!: number;

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>


}
