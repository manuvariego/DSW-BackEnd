import { getAllParkingSpace } from "../ParkingSpace/parkingSpace.business.js";
import { getAllReservationsRepository } from "../Reservation/reservation.repository.js";
import { getPriceByGarageBusiness } from "../ReservationType/reservationType.business.js";
import { Garage } from "./garage.entity.js";
import { getAllGaragesRepository } from "./garage.repository.js";

const getAvailablesBusiness = async (checkin: Date, checkout: Date, vehicleTypeId: number): Promise<Garage[]> => {

    const params = { checkin: checkin, checkout: checkout, vehicleTypeId: vehicleTypeId };

    const reservations = await getAllReservationsRepository(params);

    const countReservationByGarage = reservations.reduce<Record<number, number>>((acc, reservation) => {
      const { garage } = reservation;

      // Si el garageId ya está en el acumulador, incrementa el contador
      if (acc[garage.cuit]) {
        acc[garage.cuit]++;
      } else {
        // Si no está, inicializa el contador en 1
        acc[garage.cuit] = 1;
      }

      return acc;   // devuelve esto el contador {101: 2, 102: 2, 103: 1 }
    }, {}); // Iniciamos con un objeto vacío
  
  const garages = await getAllGaragesRepository();

  const availables = garages.filter(x => 
      (countReservationByGarage[x.cuit] === undefined && x.parkingSpaces.exists(ps => ps.TypeVehicle.id === vehicleTypeId)) || 
      (countReservationByGarage[x.cuit] < x.parkingSpaces.filter(ps => ps.TypeVehicle.id === vehicleTypeId).length));
  
  return availables;
}

const getParkingSpaceAvailable = async(checkin: Date, checkout: Date, vehicleTypeId: number, cuitGarage: number): Promise<number|null> => {
  const params = { checkin: checkin, checkout: checkout, vehicleTypeId: vehicleTypeId };
  const parkingSpaces  = await getAllParkingSpace(vehicleTypeId, cuitGarage)
  const parkingSpaceNumbers = parkingSpaces.map(x => x.number)  
  const reservations = await getAllReservationsRepository(params)
  const parkingSpaceNumberReserved = reservations.filter(x => x.garage.cuit === cuitGarage && x.vehicle.type.id === vehicleTypeId).map(x => x.parkingSpace.number)
  const parkingSpaceAvailables = parkingSpaceNumbers.filter(num => !parkingSpaceNumberReserved.includes(num))
  if(parkingSpaceAvailables != null && parkingSpaceAvailables.length > 0){
    return parkingSpaceAvailables[0];
  }
  return null;
}


const getPriceForReservationBusiness = async(checkin: Date, checkout: Date, cuitGarage: number): Promise<number> => {
    // Obtener la diferencia en horas
    const reservationsHours = (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60);
    const price = await getPriceByGarageBusiness(cuitGarage, reservationsHours);
    return price;
}


export { getAvailablesBusiness, getParkingSpaceAvailable, getPriceForReservationBusiness }
