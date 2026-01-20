import { ServiceCode } from "./service.entity.js";
import * as serviceRepository from "./service.repository.js";

async function getAllServices() {
return await serviceRepository.findAll();
}

async function getServiceById(id: number) {
return await serviceRepository.findOne(id);
}

const ALLOWED_CODES: ServiceCode[] = ['LAVADO_BASIC', 'LAVADO_PREMIUM', 'CERA', 'AIRE', 'ASPIRADO'];

async function createService(code:string, description: string, price: number) {
if (!ALLOWED_CODES.includes(code as ServiceCode)) {
    throw new Error(`Código de servicio inválido. Los códigos permitidos son: ${ALLOWED_CODES.join(', ')}`);
}
if (price < 0) {
    throw new Error("El precio no puede ser negativo.");
}
if (!description) {
    throw new Error("La descripción es obligatoria.");
}
return await serviceRepository.create({ 
      code: code, 
      description: description,
      price: price
  });

}

async function updateService(id: number, data: any) {
return await serviceRepository.update(id, data);
}

async function deleteService(id: number) {
return await serviceRepository.remove(id);
}

export { getAllServices, getServiceById, createService, updateService, deleteService }