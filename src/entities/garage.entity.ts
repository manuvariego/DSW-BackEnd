import { ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection, Property, Rel } from '@mikro-orm/core';
import { Location } from './location.entity.js';
import { ParkingSpace } from './parkingSpace.entity.js';
import { Reservation } from './reservation.entity.js';
import { ReservationType } from './reservationType.entity.js';

@Entity()
export class Garage {
    @PrimaryKey({})
    cuit!: number;

    @Property({})
    name!: string;

    @Property({})
    password!: string;

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

    @OneToMany(() => ParkingSpace, (parkingSpace) => parkingSpace.garage, {
        cascade: [Cascade.ALL],
    })
    parkingSpaces = new Collection<ParkingSpace>(this)

    @OneToMany(() => Reservation, (reservation) => reservation.garage, {
        cascade: [Cascade.ALL],
    })
    reservations = new Collection<Reservation>(this)

    @OneToMany(() => ReservationType, (reservationType) => reservationType.garage, {
        cascade: [Cascade.ALL],
    })
    reservationTypes = new Collection<ReservationType>(this)

}
