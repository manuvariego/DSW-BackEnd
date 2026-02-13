import { Entity, Property, ManyToOne, Rel, PrimaryKey } from '@mikro-orm/core';
import { Garage } from '../Garage/garage.entity.js';

@Entity()
export class ReservationType {

    @PrimaryKey({})
    description!: typeCode;

    @Property({})
    price!: number;

    @ManyToOne(() => Garage, { nullable: false, primary: true })
    garage!: Rel<Garage>

}

export type typeCode = 'HOUR' | 'HALF_DAY' | 'DAY' | 'WEEKLY' | 'HALF_MONTH' | 'MONTH';
