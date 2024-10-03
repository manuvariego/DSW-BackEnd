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

    const countReservationByGarage = reservations.reduce<Record<number, number>>((acc, reservation) => {
      const { garage } = reservation;

      // Si el garageId ya está en el acumulador, incrementa el contador
      if (acc[garage.cuit]) {
        acc[garage.cuit]++;
      } else {
        // Si no está, inicializa el contador en 1
        acc[garage.cuit] = 1;
      }

      return acc;         // devuelve esto el contador {101: 2, 102: 2, 103: 1 }
    }, {}); // Iniciamos con un objeto vacío

  console.log(countReservationByGarage);

  // contar todos los parking_space de cada garage y que sean del mismo tipo que del vehiculo  
  
  const garages = await getAllGaragesRepository();
  console.log('garages', garages);

  garages.forEach(x => console.log(x.parkingSpaces.exists(ps => ps.TypeVehicle.id === vehicleTypeId)));

  const availables = garages.filter(x => 
      (countReservationByGarage[x.cuit] === undefined && x.parkingSpaces.exists(ps => ps.TypeVehicle.id === vehicleTypeId)) || 
      (countReservationByGarage[x.cuit] < x.parkingSpaces.filter(ps => ps.TypeVehicle.id === vehicleTypeId).length));
  
  console.log(availables);
  return availables;
}


//const count

export { getAvailablesBusinnes }
