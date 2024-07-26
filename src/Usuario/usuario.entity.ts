import { baseEntity } from '../shared/baseEntity.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel, OneToMany } from '@mikro-orm/core';
import { Vehiculo } from '../Vehiculo/vehiculo.entity.js';


@Entity()
export class User extends baseEntity{
 @Property({nullable: false})
  name!: string

 @Property({nullable: false})
 lastname!: string
 
 @Property({nullable: false})
 dni!: string
 
 @Property({nullable: false})
 address!: string
 
 @Property({nullable: false})
 mail!: string
 
 @Property()
 telephone!: string

 @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.owner, {
    cascade: [Cascade.ALL],
  })
  vehiculos = new Collection<Vehiculo>(this)
}