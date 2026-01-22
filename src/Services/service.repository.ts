import { orm } from "../shared/db/orm.js";
import { Service } from "./service.entity.js";

const em = orm.em;

export async function findAll() {
return await em.find(Service, {});
}

export async function findOne(id: number) {
return await em.findOne(Service, { id });
}

export async function create(serviceData: any) {
const service = em.create(Service, serviceData);
await em.persistAndFlush(service);
return service;
}

export async function update(id: number, serviceData: any) {
const service = await em.findOneOrFail(Service, { id });
em.assign(service, serviceData);
await em.flush();
return service;
}

export async function remove(id: number) {
const service = await em.getReference(Service, id);
await em.removeAndFlush(service);
}