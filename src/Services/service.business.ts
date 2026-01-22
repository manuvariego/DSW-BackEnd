import { Garage } from "../Garage/garage.entity.js";
import * as serviceRepository from "./service.repository.js";
import { EntityManager } from "@mikro-orm/core";
import { RequestContext } from "@mikro-orm/core";


async function getAllServices() {
return await serviceRepository.findAll();
}

async function getServiceById(id: number) {
return await serviceRepository.findOne(id);
}

async function createService(garageCuit: number, description: string, price: number) {
    if (price < 0) {
        throw new Error("El precio no puede ser negativo.");
    }
    if (!description) {
        throw new Error("La descripción es obligatoria.");
    }

    const em = RequestContext.getEntityManager() as EntityManager;
    const garageOwner = await em.findOne(Garage, { cuit: garageCuit});

    if (!garageOwner) {
        throw new Error("No se encontró la cochera para vincular el servicio.");
    }
    return await serviceRepository.create({ 
          description: description,
          price: price,
          garage: garageOwner 
    });
}

async function updateService(id: number, data: any) {
return await serviceRepository.update(id, data);
}

async function deleteService(id: number) {
return await serviceRepository.remove(id);
}

export { getAllServices, getServiceById, createService, updateService, deleteService }