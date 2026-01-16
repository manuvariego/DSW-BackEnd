import { Unique, Collection, Entity, PrimaryKey, Cascade, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { Garage } from '../Garage/garage.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';
import { typeVehicle } from '../VehicleType/vehicleType.entity.js';

@Entity()
export class ParkingSpace {

    @PrimaryKey({})
    number!: number;

    @ManyToOne(() => Garage, { nullable: false, primary: true })
    garage!: Rel<Garage>

    @OneToMany(() => Reservation, (reservation) => reservation.parkingSpace, {
        cascade: [Cascade.ALL],
    })
    reservations = new Collection<Reservation>(this)

    @ManyToOne(() => typeVehicle, { nullable: false })
    TypeVehicle!: Rel<typeVehicle>

}
