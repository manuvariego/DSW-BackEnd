import { Vehicle } from "./vehicle.entity.js";
import { getVehicleRepository } from "./vehicle.repository.js";

const getVehicleBusiness = async (license_plate: string): Promise<Vehicle | null> => {
    const response = await getVehicleRepository(license_plate);
    return response;
}

export { getVehicleBusiness }
