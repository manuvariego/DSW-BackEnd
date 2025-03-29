import { ParkingSpace } from "./parkingSpace.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

export class parkingspaceRepository {
    async getAll(): Promise<ParkingSpace[]> {
        const parkingspaces = await em.find(ParkingSpace, {})
        return parkingspaces
    }

    async getOne(number: number, cuitGarage: number): Promise<ParkingSpace> {
        const parkingspace = await em.findOneOrFail(ParkingSpace, { number, garage: { cuit: cuitGarage } })
        return parkingspace
    }

    async create(parkingspace: any) {
        parkingspace = em.create(ParkingSpace, parkingspace)
        await em.flush()
        return parkingspace
    }

    async update(parkingspace: any, number: number, cuitGarage: number): Promise<ParkingSpace> {
        const parkingSpaceToUpdate = await em.findOneOrFail(ParkingSpace, { number, garage: { cuit: cuitGarage } })
        em.assign(parkingSpaceToUpdate, parkingspace)
        await em.flush()
        return parkingSpaceToUpdate
    }

    async remove(number: number, cuitGarage: number): Promise<ParkingSpace> {
        const parkingspace = await em.findOneOrFail(ParkingSpace, { number })
        await em.removeAndFlush(parkingspace)
        return parkingspace
    }

}





