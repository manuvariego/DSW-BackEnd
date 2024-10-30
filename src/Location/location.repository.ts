import { Location } from "./location.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

export class location {
    async getAll(): Promise<Location[]> {
        const locations = await em.find(Location, {}, { populate: ['garages'] })
        return locations
    }

    async getOne(id: number): Promise<Location> {
        const location = await em.findOneOrFail(Location, { id }, { populate: ['garages'] })
        return location
    }

    async create(location: any) {
        location = em.create(Location, location)
        await em.flush()
        return location
    }

    async update(location: any, id: number): Promise<Location> {
        const locationToUpdate = await em.findOneOrFail(Location, { id })
        em.assign(locationToUpdate, location)
        await em.flush()
        return locationToUpdate
    }

    async remove(id: number): Promise<Location> {
        const location = await em.findOneOrFail(Location, { id })
        await em.removeAndFlush(location)
        return location
    }

}


