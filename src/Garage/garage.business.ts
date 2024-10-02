import { getAllReservationsRepository } from "../Reservation/reservation.repository.js";
import { Garage } from "./garage.entity.js";
import { getAllGaragesRepository } from "./garage.repository.js";

const getAvailablesBusinnes = async (checkin: Date, checkout: Date, vehicleTypeId: number): Promise<Garage[]> => {

    const params = { checkin: checkin, checkout: checkout, vehicleTypeId: vehicleTypeId };
    console.log(params);

    //Lists all reservations between two given dates

    const reservations = await getAllReservationsRepository(params);
    console.log('reservations', reservations);

    //Lists available garages a garage in available if the number of parkingSpaces occupied (reserved) is less than :wq
    //

    const garages


    //const garages = await getAllGaragesRepository();
    //console.log('garages', garages);

    return new Array<Garage>;
}

const count

export { getAvailablesBusinnes }
