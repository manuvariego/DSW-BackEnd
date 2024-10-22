import { ParkingSpace } from "./parkingSpace.entity.js";
import { getAllParkingSpaceRepository} from "./parkingSpace.repository.js";

//const getPriceByGarageBusiness = async (cuitGarage: number, quantityHours: number) => {
//  const reservationsTypes = await getReservationTypesByGarageRepository(cuitGarage);
//}

const getAllParkingSpace = async (vehicleTypeId: number, cuitGarage: number):Promise<ParkingSpace[]>=>{
  return await getAllParkingSpaceRepository(vehicleTypeId, cuitGarage)
}

export { getAllParkingSpace }