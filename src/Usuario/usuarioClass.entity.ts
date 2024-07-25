import { Cascade, Entity, OneToMany, PrimaryKey, Property, Collection } from "@mikro-orm/core";
import { User } from "./usuario.entity.js";
import { baseEntity } from "../shared/baseEntity.entity.js";

@Entity()
export class UserClass extends baseEntity {

  @Property({ nullable: false, unique: true })
  name!: string;

  @Property()
  description!: string;

  //@OneToMany(()=> User, (user) => user.class, {cascade: [Cascade.ALL] })
  //users= new Collection<User>(this);

}

