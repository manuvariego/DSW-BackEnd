import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeGarageInput, getAvailables } from "./garage.controller.js";
import { validateGarageAvailables } from "./garage.validation.js";

export const GarageRouter = Router()

GarageRouter.get('/', findAll)
GarageRouter.get('/availables', validateGarageAvailables, getAvailables)
GarageRouter.get('/:cuit', findOne)
GarageRouter.post('/', sanitizeGarageInput, add)
GarageRouter.put('/:cuit', sanitizeGarageInput, update)
GarageRouter.delete('/:cuit', eliminate)
