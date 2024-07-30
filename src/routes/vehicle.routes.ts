import { Router } from "express";

import {findAll, findOne, update, add, eliminate, sanitizeVehicleInput } from "../controllers/vehicle.controller.js";

export const VehicleRouter = Router()

VehicleRouter.get('/', findAll)
VehicleRouter.get('/:license_plate', findOne)
VehicleRouter.post('/', sanitizeVehicleInput  , add)
VehicleRouter.put('/:id', sanitizeVehicleInput  , update)
VehicleRouter.delete('/:id', eliminate)
