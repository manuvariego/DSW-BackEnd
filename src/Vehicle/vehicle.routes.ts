import { Router } from "express";
import { auth } from "../middlewares/auth.js"

import { findAll, findOne, update, add, eliminate, sanitizeVehicleInput } from "./vehicle.controller.js";

export const VehicleRouter = Router()

VehicleRouter.get('/', findAll)
VehicleRouter.get('/:license_plate', findOne)
VehicleRouter.post('/', auth, sanitizeVehicleInput, add)
VehicleRouter.put('/:license_plate', sanitizeVehicleInput, update)
VehicleRouter.delete('/:license_plate', eliminate)
