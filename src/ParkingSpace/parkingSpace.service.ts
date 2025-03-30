import { ParkingSpace } from "./parkingSpace.entity.js";
import { parkingspaceRepository } from "./parkingSpace.repository.js"

//const getPriceByGarageBusiness = async (cuitGarage: number, quantityHours: number) => {
//  const reservationsTypes = await getReservationTypesByGarageRepository(cuitGarage);
//}
//

const ParkingspaceRepository = new parkingspaceRepository()

const getAllParkingSpace = async (vehicleTypeId: number, cuitGarage: number): Promise<ParkingSpace[]> => {
    return await ParkingspaceRepository.getAllByGarage(vehicleTypeId, cuitGarage)
}

export { getAllParkingSpace }
