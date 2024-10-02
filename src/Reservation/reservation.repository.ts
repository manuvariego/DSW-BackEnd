import { orm } from "../shared/db/orm.js";
import { Reservation } from "./reservation.entity.js";

const em = orm.em

interface FilterParams {
    checkin?: Date;
    checkout?: Date;
    vehicleTypeId?: number;
}

const getAllReservationsRepository = async (filters: FilterParams): Promise<Reservation[]> => {
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

export { getAllReservationsRepository }
