import { User } from "./user.entity.js";
import { Vehicle } from "../Vehicle/vehicle.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

export class userRepository {
    async getAll(): Promise<User[]> {
        const users = await em.find(User, {}, { populate: ['vehicles'] })
        return users
    }

    async getOne(id: number): Promise<User> {
        const user = await em.findOneOrFail(User, { id }, { populate: ['vehicles'] })
        return user
    }

    async create(user: any) {
        user = em.create(User, user)
        await em.flush()
        return user
    }

    async update(user: any, id: number): Promise<User> {
        const userToUpdate = await em.findOneOrFail(User, { id })
        em.assign(userToUpdate, user)
        await em.flush()
        return userToUpdate
    }

    async remove(id: number): Promise<User> {
        const user = await em.findOneOrFail(User, { id })
        await em.removeAndFlush(user)
        return user
    }


    async vehicles(id: number): Promise<Vehicle[]> {
        const vehicles = await em.find(Vehicle, { owner: id })
        return vehicles
    }

}
