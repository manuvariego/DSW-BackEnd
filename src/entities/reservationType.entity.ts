import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js'
import { Garage } from './garage.entity.js';

@Entity()
export class ReservationType extends baseEntity {

    @Property({})
    description!: string;

    @Property({})
    price!: number;

    @ManyToOne(() => Garage, { nullable: false })
    garage!: Rel<Garage>

}
