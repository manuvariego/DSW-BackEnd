import { baseEntity } from '../shared/baseEntity.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel, OneToMany } from '@mikro-orm/core';
import { UserClass } from './usuarioClass.entity.js';
import { itemUser } from './itemUser.entity.js';
//import { Vehiculo } from '../Vehiculo/vehiculo.entity.js';


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

  //@ManyToOne(() => UserClass, { nullable: false })
  //class!: Rel<UserClass>;
  //
  //@ManyToMany(() => itemUser, (itemUser) => itemUser.users, { cascade: [Cascade.ALL], owner: true, })
  //items!: itemUser[];

  //@ManyToOne(() => Vehiculo)
  //vehiculo!: Vehiculo;


}

