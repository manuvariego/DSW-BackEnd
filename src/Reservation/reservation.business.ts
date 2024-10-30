import { getVehicleBusiness } from "../Vehicle/vehicle.business.js";
import { getPriceForReservationBusiness, getParkingSpaceAvailable } from "../Garage/garage.business.js";
import { Reservation } from "./reservation.entity.js";
import { reservation } from "./reservation.repository.js"


const reservationRepository = new reservation()

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

        const result = await reservationRepository.create(reservation)
        return result;
    }

    return null;
}

const getActiveReservationsByUserBusiness = async (userId: number): Promise<Reservation[]> => {
    return await reservationRepository.getActiveReservationsByUser(userId);
}


export { createReservationBusiness, getActiveReservationsByUserBusiness }
