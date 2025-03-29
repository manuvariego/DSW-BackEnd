import { getVehicleBusiness } from "../Vehicle/vehicle.service.js";
import { getPriceForReservationBusiness, getParkingSpaceAvailable } from "../Garage/garage.service.js";
import { Reservation } from "./reservation.entity.js";
import { reservationRepository } from "./reservation.repository.js"


const ReservationRepository = new reservationRepository()

const createReservationBusiness = async (checkin: Date, checkout: Date, licensePlate: string, cuitGarage: number) => {
    const vehicle = await getVehicleBusiness(licensePlate);
    if (vehicle === null) return null;

    //cambiar y que devuelva el parking space libre. Si es nulo es porque no hay lugar disponible.
    const parkingSpaceNumber = await getParkingSpaceAvailable(checkin, checkout, vehicle?.type.id!, cuitGarage);

    if (parkingSpaceNumber != null) {

        const price = await getPriceForReservationBusiness(checkin, checkout, cuitGarage);

        const reservation = {
            date_time_reservation: new Date(),
            check_in_at: checkin,
            check_out_at: checkout,
            estado: 'activa',
            amount: price,
            garage: cuitGarage,
            parkingSpace: { number: parkingSpaceNumber, garage: cuitGarage },
            vehicle: licensePlate
        };

        const result = await ReservationRepository.create(reservation)
        return result;
    }

    return null;
}

const getActiveReservationsByUserBusiness = async (userId: number): Promise<Reservation[]> => {
    return await ReservationRepository.getActiveReservationsByUser(userId);
}


export { createReservationBusiness, getActiveReservationsByUserBusiness }
