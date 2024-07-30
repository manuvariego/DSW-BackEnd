import { User } from './user.entity.js';
import { Rel, Property, ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection } from '@mikro-orm/core';

@Entity()
export class Vehicle {
  @PrimaryKey()
  license_plate!: string; // Asumo que la patente es una cadena única que actúa como la clave primaria

  @ManyToOne(() => User, { nullable: false })
    owner!: Rel<User>

  //@ManyToOne({ entity: () => User, nullable: true })
  //owner?: User;
}
