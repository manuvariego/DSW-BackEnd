import { Garage } from "./garage.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

export class garageRepository {
    async getAll(): Promise<Garage[]> {
        const garages = await em.find(Garage, {}, { populate: ['parkingSpaces'] })
        return garages
    }

    async getOne(cuit: number): Promise<Garage> {
        const garage = await em.findOneOrFail(Garage, { cuit }, { populate: ['parkingSpaces'] })
        return garage
    }

    async create(garage: any) {
        garage = em.create(Garage, garage)
        await em.flush()
        return garage
    }

    async update(garage: any, cuit: number): Promise<Garage> {
        const garageToUpdate = await em.findOneOrFail(Garage, { cuit })
        em.assign(garageToUpdate, garage)
        await em.flush()
        return garageToUpdate
    }

    async remove(cuit: number): Promise<Garage> {
        const garage = await em.findOneOrFail(Garage, { cuit })
        await em.removeAndFlush(garage)
        return garage
    }

}


