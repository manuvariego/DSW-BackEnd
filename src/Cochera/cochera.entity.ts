import { ManyToOne, Entity, PrimaryKey, OneToMany, Cascade, Collection, Property, Rel } from '@mikro-orm/core';
import { Localidad } from '../Localidad/localidad.entity.js';

@Entity()
export class Cochera {
  @PrimaryKey({ type: 'number' })
  cuit!: number;

  @Property({ type: 'string' })
  nombre!: string;

  @Property({ type: 'string' })
  direccion!: string;

  @Property({ type: 'string' })
  telefono!: string;

  @Property({ type: 'string' })
  correo!: string;

  @Property({ type: 'number' })
  precioHora!: number;

  @ManyToOne(() => Localidad, { nullable: false })
  localidad!: Rel<Localidad>
}
