import { Collection, Entity, OneToMany, Property, Cascade } from '@mikro-orm/core';
import { baseEntity } from "../shared/baseEntity.entity.js";
import { Cochera } from "../Cochera/cochera.entity.js";

@Entity()
export class Localidad extends baseEntity {
  @Property({ type: 'string' })
  nombre!: string;

  @Property({ type: 'string' })
  provincia!: string;

  @OneToMany(() => Cochera, (cochera) => cochera.localidad, {
    cascade: [Cascade.ALL],
  })
  cocheras = new Collection<Cochera>(this)
}




