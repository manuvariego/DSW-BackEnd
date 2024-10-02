import { orm } from "../shared/db/orm.js";
import { Reservation } from "./reservation.entity.js";

const em = orm.em

interface FilterParams {
  checkin?: Date;
  checkout?: Date;
  vehicleTypeId?: number;
}

const getAllReservationsRepository = async (filters: FilterParams): Promise<Reservation[]> => {
  const queryFilters: any = {};

  // Filtro por rango de fechas (si ambos parámetros están presentes)
  // if (filters.checkin && filters.checkout) {
  //   queryFilters.check_in_at = { $gte: filters.checkin, $lte: filters.checkout };
  // }

  // Filtro por tipo de vehiculo
  if (filters.vehicleTypeId !== undefined) {
    console.log('vehicleTypeId', filters.vehicleTypeId);
    // Asegúrate de que `parkingSpace` y `typeVehicle` estén definidos
    queryFilters.vehicle = {};
    queryFilters.vehicle.type = {};
    
    // Ahora puedes asignar el filtro al campo id de `typeVehicle`
    queryFilters.vehicle.type.id = filters.vehicleTypeId;
  }

  // queryFilters.vehicle = {};
  // queryFilters.vehicle.type = {};
  // queryFilters.vehicle.type.id = 1;
  // Realizamos la consulta utilizando los filtros dinámicos
  const reservas = await em.find(Reservation, queryFilters);
  return reservas;
}

export { getAllReservationsRepository }