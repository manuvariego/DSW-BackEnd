import { createReservationRepository, getActiveReservationsByUserRepository } from "./reservation.repository.js";
import { getVehicleBusiness } from "../Vehicle/vehicle.business.js";
import { getPriceForReservationBusiness, getParkingSpaceAvailable } from "../Garage/garage.business.js";
import { Reservation, ReservationStatus } from "./reservation.entity.js";
import { orm } from "../shared/db/orm.js"; 
import { Service } from "../Services/service.entity.js";

const em = orm.em;

const createReservationBusiness = async (checkin: Date, checkout: Date, licensePlate: string, cuitGarage: number, servicesIds: number[] = []) => {
  const vehicle = await getVehicleBusiness(licensePlate);
  if (vehicle === null) return null;
  
  const parkingSpaceNumber = await getParkingSpaceAvailable(checkin, checkout, vehicle?.type.id!, cuitGarage);

  if (parkingSpaceNumber != null){
    //calcula el precio base 
    const price = await getPriceForReservationBusiness(checkin, checkout, cuitGarage);

    let servicesPrice = 0;
    if (servicesIds.length > 0) {
        const servicesFound = await em.find(Service, { id: { $in: servicesIds } });
        servicesPrice = servicesFound.reduce((total, s) => total + Number(s.price), 0);
    }

    // precio total
    const totalAmount = price + servicesPrice;

    const reservation = {
      date_time_reservation: new Date(),
      check_in_at: checkin,
      check_out_at: checkout,
      estado: ReservationStatus.ACTIVE,
      amount: totalAmount,
      garage: cuitGarage,
      parkingSpace: {number: parkingSpaceNumber, garage: cuitGarage},
      vehicle: licensePlate,
      services: servicesIds
    };

    const result = await createReservationRepository(reservation);
    return result;
  }

  return null;
}

const getActiveReservationsByUserBusiness = async (userId: number): Promise<Reservation[]> => {
  return await getActiveReservationsByUserRepository(userId);
}


export { createReservationBusiness, getActiveReservationsByUserBusiness }