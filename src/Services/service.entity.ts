import { Entity, Cascade, Collection, Property, ManyToMany} from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';
import { Garage } from '../Garage/garage.entity.js';

export type ServiceCode = 'LAVADO_BASIC' | 'LAVADO_PREMIUM' | 'CERA' | 'AIRE' | 'ASPIRADO';

@Entity()
export class Service extends baseEntity{

    @Property({ nullable: false, unique: true }) 
    code!: ServiceCode;

    @Property({})
    description!: string;

    @Property({})
    price!: number;

    @ManyToMany (() => Reservation, reservation => reservation.services)
    reservations = new Collection<Reservation>(this);

    @ManyToMany(() => Garage, garage => garage.services)
    garages = new Collection<Garage>(this);
}