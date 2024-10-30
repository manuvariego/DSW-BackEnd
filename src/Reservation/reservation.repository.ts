import { orm } from "../shared/db/orm.js";
import { Reservation } from "./reservation.entity.js";

const em = orm.em

interface FilterParams {
    checkin?: Date;
    checkout?: Date;
    vehicleTypeId?: number;
}

export class reservation {
    async getAll(): Promise<Reservation[]> {
        const reservations = await em.find(Reservation, {})
        return reservations
    }

    async getOne(id: number): Promise<Reservation> {
        const reservation = await em.findOneOrFail(Reservation, { id })
        return reservation
    }

    async create(reservation: any) {
        reservation = em.create(Reservation, reservation)
        await em.flush()
        return reservation
    }

    async update(reservation: any, id: number): Promise<Reservation> {
        const reservationToUpdate = await em.findOneOrFail(Reservation, { id })
        em.assign(reservationToUpdate, reservation)
        await em.flush()
        return reservationToUpdate
    }

    async remove(id: number): Promise<Reservation> {
        const reservation = em.getReference(Reservation, id)
        await em.removeAndFlush(reservation)
        return reservation
    }

    async getReservationsByDate(filters: FilterParams): Promise<Reservation[]> {
        const reservasCocheras = await em.find(Reservation, {
            $or: [
                {
                    check_in_at: {
                        $gte: filters.checkin,
                        $lte: filters.checkout
                    }
                },
                {
                    check_out_at: {
                        $gte: filters.checkin,
                        $lte: filters.checkout
                    }
                },
                {
                    check_in_at: {
                        $lte: filters.checkin
                    },
                    check_out_at: {
                        $gte: filters.checkout
                    }
                },
            ],

            estado: 'activa',
            parkingSpace: {
                TypeVehicle: {
                    id: filters.vehicleTypeId
                },
            }
        });

        return reservasCocheras;


    }

    async getActiveReservationsByUser(userId: number): Promise<Reservation[]> {
        return em.find(Reservation, {
            vehicle: {
                owner: userId
            },
            estado: 'activa'
        });

    }



}



