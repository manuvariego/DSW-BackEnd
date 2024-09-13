import { ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection, Property, Rel } from '@mikro-orm/core';
import { Location } from './location.entity.js';
import { Parking_space } from './parking_space.entity.js';
import { Reservation } from './reservation.entity.js';

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

  @OneToMany(() => Parking_space, (parking_space) => parking_space.garage, {
    cascade: [Cascade.ALL],
  })
  parking_spaces = new Collection<Parking_space>(this)

  @OneToMany(() => Reservation, (reservation) => reservation.garage, {
    cascade: [Cascade.ALL],
  })
  reservations = new Collection<Reservation>(this)


}
