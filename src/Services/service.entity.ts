import { Entity, Cascade, Collection, Property, OneToMany, ManyToOne} from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js';
import type { Garage } from '../Garage/garage.entity.js';
import { ReservationService } from '../Reservation/reservationService.entity.js';

@Entity()
export class Service extends baseEntity{
    @Property({})
    description!: string;

    @Property({})
    price!: number;

    @OneToMany(() => ReservationService, rs => rs.service)
    reservationServices = new Collection<ReservationService>(this);

    @ManyToOne(() => 'Garage', { nullable: false })
    garage!: Garage;
}