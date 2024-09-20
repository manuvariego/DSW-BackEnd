import { Collection, Entity, PrimaryKey, Cascade, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { Garage } from './garage.entity.js';
import { Reservation } from './reservation.entity.js';
import { TypeVehicle } from './typeVehicle.entity.js';

@Entity()
export class ParkingSpace {
 
  @PrimaryKey({})
  number!: number;

  @ManyToOne(() => Garage, { nullable: false })
  garage!: Rel<Garage>

  @OneToMany(() => Reservation, (reservation) => reservation.parkingSpace, {
    cascade: [Cascade.ALL],
  })
  reservations = new Collection<Reservation>(this)

  @ManyToOne(() => TypeVehicle, { nullable: false })
  TypeVehicle!: Rel<TypeVehicle>

}