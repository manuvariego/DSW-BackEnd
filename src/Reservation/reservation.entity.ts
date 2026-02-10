import { ManyToOne, Entity, Property, Rel, DateTimeType, OneToMany, Collection } from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js'
import { Vehicle } from '../Vehicle/vehicle.entity.js';
import { Garage } from '../Garage/garage.entity.js';
import { ParkingSpace } from '../ParkingSpace/parkingSpace.entity.js';
import { ReservationService } from './reservationService.entity.js';

export enum ReservationStatus {
    ACTIVE = 'activa',
    IN_PROGRESS = 'en_curso',
    CANCELLED = 'cancelada',
    COMPLETED = 'completada'
}

@Entity()
export class Reservation extends baseEntity {
    @Property({ type: 'datetime' })
    date_time_reservation!: Date;

    @Property({ type: 'datetime' })
    check_in_at!: Date;

    @Property({ type: 'datetime' })
    check_out_at!: Date;

    @Property({ default: ReservationStatus.ACTIVE })
    status: ReservationStatus = ReservationStatus.ACTIVE;

    @Property({})
    amount!: number;

    @Property({ nullable: true })
    paymentMethod?: string;

    @ManyToOne(() => Vehicle, { nullable: false })
    vehicle!: Rel<Vehicle>

    @ManyToOne(() => Garage, { nullable: false })
    garage!: Rel<Garage>

    @ManyToOne(() => ParkingSpace, { nullable: false })
    parkingSpace!: Rel<ParkingSpace>

    @OneToMany(() => ReservationService, rs => rs.reservation)
    reservationServices = new Collection<ReservationService>(this);
}
