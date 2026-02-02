import { ManyToOne, Entity, Property, Rel, DateTimeType, ManyToMany, Collection } from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js'
import { Vehicle } from '../Vehicle/vehicle.entity.js';
import { Garage } from '../Garage/garage.entity.js';
import { ParkingSpace } from '../ParkingSpace/parkingSpace.entity.js';
import { Service } from '../Services/service.entity.js';

export enum ReservationStatus {
    ACTIVE = 'activa',
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
    estado: ReservationStatus = ReservationStatus.ACTIVE;

    @Property({})
    amount!: number;

    @Property({ nullable: true })
    paymentMethod?: string; // 'Efectivo' o 'MP'

    @ManyToOne(() => Vehicle, { nullable: false })
    vehicle!: Rel<Vehicle>

    @ManyToOne(() => Garage, { nullable: false })
    garage!: Rel<Garage>

    @ManyToOne(() => ParkingSpace, { nullable: false })
    parkingSpace!: Rel<ParkingSpace>

    @ManyToMany(() => Service, 'reservations', { owner: true })
    services = new Collection<Service>(this);
}
