import { User } from '../Usuario/usuario.entity.js';
import { Property, ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection } from '@mikro-orm/core';

@Entity()
export class Vehiculo {
  @PrimaryKey()
  patente!: string; // Asumo que la patente es una cadena única que actúa como la clave primaria

  @Property()
  tipo!: string;
  //@ManyToOne(() => User)
  //usuario!: User;
  @OneToMany(() => User, (usuario) => usuario.vehiculo, {
    cascade: [Cascade.ALL],
  })
  usuarios = new Collection<User>(this);
}
