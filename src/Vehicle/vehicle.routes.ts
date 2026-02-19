import { Router } from "express";

import { findAll, findOne, findByOwner, add, eliminate, sanitizeVehicleInput } from "./vehicle.controller.js";

export const VehicleRouter = Router()

VehicleRouter.get('/', findAll)
VehicleRouter.get('/owner/:ownerId', findByOwner)
VehicleRouter.get('/:license_plate', findOne)
VehicleRouter.post('/', sanitizeVehicleInput, add)
VehicleRouter.delete('/:license_plate', eliminate)
