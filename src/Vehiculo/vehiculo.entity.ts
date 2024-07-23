/*import crypto from 'node:crypto'
import { baseEntity } from '../shared/baseEntity.entity.js';
import { Entity, PrimaryKey, OneToMany, Cascade, Collection} from '@mikro-orm/core';
import { User } from '../Usuario/usuario.entity.js';

@Entity()
export class Vehiculo  {
 @PrimaryKey()
  patente?: number

  @OneToMany(() => User, (usuario) => Vehiculo, {
    cascade: [Cascade.ALL],
  })
  vehiculos = new Collection<Vehiculo>(this)
}*/

import { Entity, PrimaryKey, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { User } from '../Usuario/usuario.entity.js';

@Entity()
export class Vehiculo {
  @PrimaryKey()
  patente!: string; // Asumo que la patente es una cadena única que actúa como la clave primaria

  @OneToMany(() => User, (usuario) => usuario.vehiculo, {
    cascade: [Cascade.ALL],
  })
  usuarios = new Collection<User>(this);
}