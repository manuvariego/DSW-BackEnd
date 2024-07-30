import { Collection, Entity, Cascade, OneToMany, Property } from '@mikro-orm/core';
import { baseEntity } from "../shared/baseEntity.entity.js";
import { Garage } from "../entities/garage.entity.js";

@Entity()
export class Location extends baseEntity {
  @Property({})
  name!: string;

  @Property({})
  province!: string;

  @OneToMany(() => Garage, (garage) => garage.location, {
    cascade: [Cascade.ALL],
  })
  garages = new Collection<Garage>(this)

}


