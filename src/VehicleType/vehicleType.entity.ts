import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { baseEntity } from "../shared/baseEntity.entity.js";
import { Vehicle } from "../Vehicle/vehicle.entity.js";

@Entity()
export class typeVehicle extends baseEntity {

    @Property({ nullable: false })
    name!: string

    @OneToMany(() => Vehicle, (vehicle) => vehicle.type, { cascade: [Cascade.ALL] })
    vehicles = new Collection<Vehicle>(this)

}
