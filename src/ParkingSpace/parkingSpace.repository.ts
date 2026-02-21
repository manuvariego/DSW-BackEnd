import { orm } from "../shared/db/orm.js";
import { ParkingSpace } from "./parkingSpace.entity.js";

const em = orm.em

const getAllParkingSpaceRepository = async (vehicleTypeId: number, cuitGarage: number):Promise<ParkingSpace[]> => {
  const parkingSpaces = await em.find(ParkingSpace, { garage: {cuit: cuitGarage}, TypeVehicle: {id: vehicleTypeId}})
  return parkingSpaces;
}


export { getAllParkingSpaceRepository }