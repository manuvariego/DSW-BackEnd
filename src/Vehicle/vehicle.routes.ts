import { Router } from "express";

import { findAll, findOne, findByOwner, add, eliminate, sanitizeVehicleInput } from "./vehicle.controller.js";
import { authenticate, authorizeUser } from "../shared/middleware/auth.middleware.js";

export const VehicleRouter = Router()

VehicleRouter.get('/', authenticate, findAll)
VehicleRouter.get('/owner/:ownerId', authenticate, findByOwner)
VehicleRouter.get('/:license_plate', authenticate, findOne)
VehicleRouter.post('/', authenticate, authorizeUser, sanitizeVehicleInput, add)
VehicleRouter.delete('/:license_plate', authenticate, authorizeUser, eliminate)