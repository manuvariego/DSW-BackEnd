import { Collection, Entity, PrimaryKey, Cascade, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Garage } from './garage.entity.js';

@Entity()
export class Parking_space {
 
  @PrimaryKey({})
  number!: number;

  @ManyToOne(() => Garage, { nullable: false })
  garage!: Rel<Garage>

}