import { Entity, Property, ManyToOne, Rel, PrimaryKey } from '@mikro-orm/core';
import { Garage } from '../Garage/garage.entity.js';

@Entity()
export class ReservationType {

    //Los codigos de los tipos de reserva pueden ser [HOUR, HALF_DAY, DAILY, WEEKLY, HALF_MONTH, MONTH]
    @PrimaryKey({})
    description!: typeCode;

    @Property({})
    price!: number;

    @ManyToOne(() => Garage, { nullable: false, primary: true })
    garage!: Rel<Garage>

}

export type typeCode = 'HOUR' | 'HALF_DAY' | 'DAY' | 'WEEKLY' | 'HALF_MONTH' | 'MONTH';
