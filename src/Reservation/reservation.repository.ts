import { Service } from "../Services/service.entity.js";
import { orm } from "../shared/db/orm.js";
import { Reservation, ReservationStatus } from "./reservation.entity.js";
import { ReservationService, ServiceStatus } from "./reservationService.entity.js";

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

        estado: { $in: [ReservationStatus.ACTIVE, ReservationStatus.IN_PROGRESS] },
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
            const reservationService = em.create(ReservationService, {
                reservation: reservation,
                service: em.getReference(Service, serviceId),
                status: ServiceStatus.PENDIENTE
            });
            em.persist(reservationService);
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
        estado: { $in: [ReservationStatus.ACTIVE, ReservationStatus.IN_PROGRESS] }
    });
}

const findReservations = async (filters: any) => {
  return await em.find(Reservation, filters, {
    populate: ['reservationServices', 'reservationServices.service', 'vehicle', 'vehicle.owner'] as const
  });
};

export { getAllReservationsRepository, createReservationRepository, findReservations, getActiveReservationsByUserRepository }
