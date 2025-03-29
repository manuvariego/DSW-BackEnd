import { Vehicle } from "./vehicle.entity.js";
//import { getVehicleRepository } from "./vehicle.repository.js";
import { vehicleRepository } from "./vehicle.repository.js"

const VehicleRepository = new vehicleRepository()

const getVehicleBusiness = async (license_plate: string): Promise<Vehicle | null> => {
    const response = await VehicleRepository.getOne(license_plate)
    return response;
}

export { getVehicleBusiness }
