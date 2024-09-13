import { Collection, Entity, PrimaryKey, Cascade, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { Garage } from './garage.entity.js';
import { Reservation } from './reservation.entity.js';

@Entity()
export class Parking_space {
 
  @PrimaryKey({})
  number!: number;

  @ManyToOne(() => Garage, { nullable: false })
  garage!: Rel<Garage>

  @OneToMany(() => Reservation, (reservation) => reservation.parking_space, {
    cascade: [Cascade.ALL],
  })
  reservations = new Collection<Reservation>(this)

}