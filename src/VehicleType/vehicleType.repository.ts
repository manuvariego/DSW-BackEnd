import { typeVehicle } from "./vehicleType.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

export class typevehicleRepository {
    async getAll(): Promise<typeVehicle[]> {
        const typeVehicles = await em.find(typeVehicle, {}, { populate: ['vehicles'] })
        return typeVehicles
    }

    async getOne(id: number): Promise<typeVehicle> {
        const typevehicle = await em.findOneOrFail(typeVehicle, { id }, { populate: ['vehicles'] })
        return typevehicle
    }

    async create(typevehicle: any) {
        typevehicle = em.create(typeVehicle, typevehicle)
        await em.flush()
        return typevehicle
    }

    async update(vehicleType: any, id: number): Promise<typeVehicle> {
        const updatedTypeVehicle = await em.findOneOrFail(typeVehicle, { id })
        em.assign(updatedTypeVehicle, vehicleType)
        await em.flush()
        return updatedTypeVehicle
    }

    async remove(id: number): Promise<typeVehicle> {
        const typevehicle = await em.findOneOrFail(typeVehicle, { id })
        await em.removeAndFlush(typevehicle)
        return typevehicle
    }

}









