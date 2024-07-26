import { Entity, PrimaryKey, Cascade, Collection, ManyToOne, Rel} from '@mikro-orm/core';
import { User } from '../Usuario/usuario.entity.js';

@Entity()
export class Vehiculo {
  @PrimaryKey()
  patente!: string; // Asumo que la patente es una cadena única que actúa como la clave primaria

 @ManyToOne(() => User, { nullable: false })
  owner!: Rel<User>
}