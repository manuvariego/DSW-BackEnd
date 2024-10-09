import { orm } from "../shared/db/orm.js";
import { Reservation } from "./reservation.entity.js";

const em = orm.em

interface FilterParams {
    checkin?: Date;
    checkout?: Date;
    vehicleTypeId?: number;
}

const getAvailableReservations = async (filters: FilterParams): Promise<Reservation[]> => {
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
            }
        ],

        parkingSpace: {
            TypeVehicle: {
                id: filters.vehicleTypeId
            },
        }
    });

    return reservasCocheras;
}

const getAllReservations = async (): Promise<Reservation[]> => {
    const reservations = em.find(Reservation, {})
    return reservations
}

const getReservationsByUser = async (userId: number): Promise<Reservation[]> => {
    //const reservations = em.find
    const reservations = await em.find(Reservation, {
        vehicle: {
            owner: userId
        }
    })

    return reservations


}


export { getAllReservations, getReservationsByUser, getAvailableReservations }
