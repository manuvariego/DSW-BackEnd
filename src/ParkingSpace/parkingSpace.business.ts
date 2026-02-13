import { ParkingSpace } from "./parkingSpace.entity.js";
import { getAllParkingSpaceRepository} from "./parkingSpace.repository.js";

const getAllParkingSpace = async (vehicleTypeId: number, cuitGarage: number):Promise<ParkingSpace[]>=>{
  return await getAllParkingSpaceRepository(vehicleTypeId, cuitGarage)
}

export { getAllParkingSpace }