import { ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection, Property, Rel, DateTimeType } from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js'
import { Vehicle } from '../Vehicle/vehicle.entity.js';
import { Garage } from '../Garage/garage.entity.js';
import { ParkingSpace } from '../ParkingSpace/parkingSpace.entity.js';


@Entity()
export class Reservation extends baseEntity {
    @Property({ type: 'datetime' })
    date_time_reservation!: Date;

    @Property({ type: 'datetime' })
    check_in_at!: Date;

    @Property({ type: 'datetime' })
    check_out_at!: Date;

    @Property({})
    estado!: string;

    @Property({})
    amount!: number;

    @ManyToOne(() => Vehicle, { nullable: false })
    vehicle!: Rel<Vehicle>

    @ManyToOne(() => Garage, { nullable: false })
    garage!: Rel<Garage>

    @ManyToOne(() => ParkingSpace, { nullable: false })
    parkingSpace!: Rel<ParkingSpace>
}
