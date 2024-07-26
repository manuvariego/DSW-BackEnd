import { User } from './usuario.entity.js';
import { Rel, Property, ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection } from '@mikro-orm/core';

@Entity()
export class Vehiculo {
  @PrimaryKey()
  patente!: string; // Asumo que la patente es una cadena única que actúa como la clave primaria

  @Property()
  tipo!: string;

  @ManyToOne(() => User, { nullable: false })
    owner!: Rel<User>
}