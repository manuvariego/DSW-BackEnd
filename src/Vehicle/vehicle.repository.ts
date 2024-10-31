import { Vehicle } from "./vehicle.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

export class vehicle {
    async getAll(): Promise<Vehicle[]> {
        const vehicles = await em.find(Vehicle, {})
        return vehicles
    }

    async getOne(license_plate: string): Promise<Vehicle> {
        const vehicle = await em.findOneOrFail(Vehicle, { license_plate },)
        return vehicle
    }

    async create(vehicle: any) {
        vehicle = em.create(Vehicle, vehicle)
        await em.flush()
        return vehicle
    }

    async update(vehicle: any, license_plate: string): Promise<Vehicle> {
        const vehicleToUpdate = await em.findOneOrFail(Vehicle, { license_plate })
        em.assign(vehicleToUpdate, vehicle)
        await em.flush()
        return vehicleToUpdate
    }

    async remove(license_plate: string): Promise<Vehicle> {
        const vehicle = await em.findOneOrFail(Vehicle, { license_plate })
        await em.removeAndFlush(vehicle)
        return vehicle
    }

}









