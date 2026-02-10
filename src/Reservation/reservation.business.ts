import { createReservationRepository, findReservations, getActiveReservationsByUserRepository } from "./reservation.repository.js";
import { getVehicleBusiness } from "../Vehicle/vehicle.business.js";
import { getPriceForReservationBusiness, getParkingSpaceAvailable } from "../Garage/garage.business.js";
import { Reservation, ReservationStatus } from "./reservation.entity.js";
import { findOne } from "../Services/service.controller.js";

const createReservationBusiness = async (checkin: Date, checkout: Date, licensePlate: string, cuitGarage: number, services: number[], price: number, paymentMethod: string) => {
  const vehicle = await getVehicleBusiness(licensePlate);
  if (vehicle === null) return null;
  
  //cambiar y que devuelva el parking space libre. Si es nulo es porque no hay lugar disponible.
  const parkingSpaceNumber = await getParkingSpaceAvailable(checkin, checkout, vehicle?.type.id!, cuitGarage);

  if (parkingSpaceNumber != null){
    
    // const price = await getPriceForReservationBusiness(checkin, checkout, cuitGarage);

    const reservation = {
      date_time_reservation: new Date(),
      check_in_at: checkin,
      check_out_at: checkout,
      estado: ReservationStatus.ACTIVE,
      amount: price,
      garage: cuitGarage,
      parkingSpace: {number: parkingSpaceNumber, garage: cuitGarage},
      vehicle: licensePlate,
      services: services,
      paymentMethod: paymentMethod
    };

    const result = await createReservationRepository(reservation);
    return result;
  }

  return null;
}

const getActiveReservationsByUserBusiness = async (userId: number): Promise<Reservation[]> => {
  return await getActiveReservationsByUserRepository(userId);
}

const getGarageReservationsBusiness = async (cuitGarage: number, query: any, condition: string) => {
  const filters: any = { garage: { cuit: cuitGarage } };

  // Logic to build filters
  if (query.license_plate) filters.vehicle = { license_plate: query.license_plate };
  if (query.estado) filters.estado = query.estado;

  // Date Logic
  const checkIn = query.check_in_at ? new Date(query.check_in_at) : undefined;
  const checkOut = query.check_out_at ? new Date(query.check_out_at) : undefined;

  if (checkIn && checkOut) {
    filters.check_in_at = { $gte: checkIn, $lte: checkOut };
  } else if (checkIn) {
    filters.check_in_at = { $gte: checkIn };
  } else if (checkOut) {
    filters.check_in_at = { $lte: checkOut };
  }

  const reservations = await findReservations(filters);

  // Business logic: Calculate revenue if condition is true
  if (condition === 'true') {
    console.log("hola", reservations);
    const totalRevenue = reservations.reduce((sum, item) => sum + Number(item.amount), 0);
    return { totalRevenue };
  }

  return reservations;
};

export { createReservationBusiness, getActiveReservationsByUserBusiness, getGarageReservationsBusiness }