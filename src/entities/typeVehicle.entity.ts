import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { baseEntity } from "../shared/baseEntity.entity.js";
import { Vehicle } from "./vehicle.entity.js";
import { ParkingSpace } from "./parkingSpace.entity.js";

@Entity()
export class TypeVehicle extends baseEntity{

@Property({nullable: false})
name!: string

@OneToMany(() => Vehicle, (vehicle) => vehicle.type, {cascade: [Cascade.ALL]})
vehicles = new Collection<Vehicle>(this)

@OneToMany(() => ParkingSpace, (parkingSpace) => parkingSpace.TypeVehicle, {cascade: [Cascade.ALL]})
parkingSpaces = new Collection<ParkingSpace>(this)

}