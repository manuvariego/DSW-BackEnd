import { getAllReservationsRepository } from "../Reservation/reservation.repository.js";
import { Garage } from "./garage.entity.js";
import { getAllGaragesRepository } from "./garage.repository.js";

const getAvailablesBusinnes = async (checkin: Date, checkout: Date, vehicleTypeId: number): Promise<Garage[]> => {

  const params = {checkin: checkin, checkout: checkout, vehicleTypeId: vehicleTypeId};
  console.log(params);

  const reservations = await getAllReservationsRepository(params);
  console.log('reservations', reservations);

  const garages = await getAllGaragesRepository();
  console.log('garages', garages);

  return new Array<Garage>;
}

export { getAvailablesBusinnes }