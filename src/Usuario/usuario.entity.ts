import { Vehiculo } from '../Vehiculo/vehiculo.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel, OneToMany } from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js';


@Entity()
export class User extends baseEntity {
  @Property({ nullable: false, type: 'string' })
  name!: string;

  @Property({ nullable: false, type: 'string' })
  lastname!: string;

  @Property({ nullable: false, type: 'string' })
  dni!: string;

  @Property({ nullable: false, type: 'string' })
  address!: string;

  @Property({ nullable: false, type: 'string' })
  mail!: string;

  @Property({ type: 'string' })
  telephone!: string;
  
  @ManyToOne(() => Vehiculo)
  vehiculo!: Vehiculo;

  //@OneToMany(() => Vehiculo, (vehiculo) => vehiculo.usuario, {
  //  cascade:[Cascade.ALL],
  //})
  //vehiculos = new Collection<Vehiculo>(this);

}

