import { Entity, OneToMany, Property, Cascade } from "@mikro-orm/core";
import { baseEntity } from "../shared/baseEntity.entity.js";

@Entity()
export class Localidad extends baseEntity{
  @Property()
  nombre!: string
  
  @Property()
  provincia!: string

 /* @OneToMany(() => Cochera, (cochera) => cochera.localidad, {
  cascade: [Cascade.ALL],
  })
  cocheras = new Collection<Cochera>(this)
  */
}
