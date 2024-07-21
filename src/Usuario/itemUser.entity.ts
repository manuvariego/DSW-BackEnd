import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { baseEntity } from "../shared/baseEntity.entity.js";
import { User } from "./usuario.entity.js";

@Entity()
export class itemUser extends baseEntity{

 @Property({nullable:false})
 name!: string

 @Property()
 desc!: string

 @ManyToMany(()=> User, (user) => user.items)
 users = new Collection<User>(this)

}