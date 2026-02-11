import { Router } from "express";

import { findAll, findOne, findByOwner, update, add, eliminate, sanitizeVehicleInput } from "./vehicle.controller.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const VehicleRouter = Router()

VehicleRouter.get('/', authenticate, findAll)
VehicleRouter.get('/owner/:ownerId', authenticate, findByOwner)
VehicleRouter.get('/:license_plate', authenticate, findOne)
VehicleRouter.post('/', authenticate, sanitizeVehicleInput, add)
VehicleRouter.put('/:license_plate', authenticate, sanitizeVehicleInput, update)
VehicleRouter.delete('/:license_plate', authenticate, eliminate)
