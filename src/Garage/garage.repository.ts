import { Garage } from "./garage.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

const getAllGaragesRepository = async (): Promise<Garage[]> => {
 return await em.find(Garage, {}, { populate: ['parkingSpaces', 'services'] });
}



export { getAllGaragesRepository }