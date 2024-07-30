import { Vehicle } from './vehicle.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel, OneToMany } from '@mikro-orm/core';
import { baseEntity } from '../shared/baseEntity.entity.js'


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
 email!: string
 
 @Property()
 phone_number!: string

 @OneToMany(() => Vehicle, (vehicle) => vehicle.owner, {
    cascade: [Cascade.ALL],
  })
  vehicles = new Collection<Vehicle>(this)
}
