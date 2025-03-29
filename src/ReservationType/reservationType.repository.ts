import { orm } from "../shared/db/orm.js";
import { ReservationType } from "./reservationType.entity.js";

const em = orm.em

export class reservationTypeRepository {
    async getAll(): Promise<ReservationType[]> {
        const reservationTypes = await em.find(ReservationType, {})
        return reservationTypes
    }

    async getOne(cuitGarage: number, description: any): Promise<ReservationType> {
        const reservationType = await em.findOneOrFail(ReservationType, { description, garage: { cuit: cuitGarage } })
        return reservationType
    }

    async create(reservationType: any) {
        reservationType = em.create(ReservationType, reservationType)
        await em.flush()
        return reservationType
    }

    async update(reservationType: any, cuitGarage: number, description: any): Promise<ReservationType> {
        const reservationTypeToUpdate = await em.findOneOrFail(ReservationType, { description, garage: { cuit: cuitGarage } })
        em.assign(reservationTypeToUpdate, reservationType)
        await em.flush()
        return reservationTypeToUpdate
    }

    async remove(description: any, cuitGarage: number): Promise<ReservationType> {
        const reservationType = await em.findOneOrFail(ReservationType, { description, garage: { cuit: cuitGarage } })
        await em.removeAndFlush(reservationType)
        return reservationType
    }

    async getReservationTypeByGarageRepository(cuitGarage: number): Promise<ReservationType[]> {
        const reservationTypes = await em.find(ReservationType, {
            garage: {
                cuit: cuitGarage
            }
        });

        return reservationTypes;
    }
}
