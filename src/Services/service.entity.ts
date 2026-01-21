import { Entity, Cascade, Collection, Property, ManyToMany, ManyToOne} from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';
import type { Garage } from '../Garage/garage.entity.js';

@Entity()
export class Service extends baseEntity{
    @Property({})
    description!: string;

    @Property({})
    price!: number;

    @ManyToMany (() => Reservation, reservation => reservation.services)
    reservations = new Collection<Reservation>(this);

    @ManyToOne(() => 'Garage', { nullable: false })
    garage!: Garage;
}