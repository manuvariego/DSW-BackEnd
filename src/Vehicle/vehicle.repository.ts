import { Vehicle } from "./vehicle.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

const getVehicleRepository = async (license_plate: string): Promise<Vehicle | null> => {
  return await em.findOne(Vehicle, { license_plate })
}

export { getVehicleRepository }