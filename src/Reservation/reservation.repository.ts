import { Service } from "../Services/service.entity.js";
import { orm } from "../shared/db/orm.js";
import { Reservation, ReservationStatus } from "./reservation.entity.js";

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
            },
        ],

        estado: ReservationStatus.ACTIVE,
        parkingSpace: {
            TypeVehicle: {
                id: filters.vehicleTypeId
            },
        }
    }, {
        populate: ['vehicle', 'vehicle.type', 'garage', 'parkingSpace']
    });

    return reservasCocheras;
}


const createReservationRepository = async (reservationData: any) => {
    const { services, ...data } = reservationData;
    const reservation = em.create(Reservation, data);

    if (services && services.length > 0) {
        services.forEach((serviceId: number) => {
            // 'getReference' crea un puntero al servicio sin consultar la DB (muy rápido)
            const serviceRef = em.getReference(Service, serviceId);
            
            // Agregamos la referencia a la colección. 
            // Esto le dice al ORM: "Creá una fila en la tabla intermedia para unir esta reserva con este servicio"
            reservation.services.add(serviceRef);
        });
    }

    await em.flush();
    return reservation;
}


const getActiveReservationsByUserRepository = async(userId: number): Promise<Reservation[]>=> {
    return em.find(Reservation, {
        vehicle: {
            owner: userId
        },
        estado: ReservationStatus.ACTIVE
    });
}

const findReservations = async (filters: any) => {
  return await em.find(Reservation, filters, {
    populate: ['services', 'vehicle', 'vehicle.owner'] as const
  });
};

export { getAllReservationsRepository, createReservationRepository, findReservations, getActiveReservationsByUserRepository }
