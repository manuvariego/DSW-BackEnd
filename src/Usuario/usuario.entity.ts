import crypto from 'node:crypto'
import { baseEntity } from '../shared/baseEntity.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { UserClass } from './usuarioClass.entity.js';
import { itemUser } from './itemUser.entity.js';

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

 @ManyToOne(()=> UserClass, {nullable:false})
 class!: Rel<UserClass>

 @ManyToMany(()=> itemUser, (itemUser) => itemUser.users, {cascade: [Cascade.ALL], owner: true,})
 items!: itemUser[]


}

