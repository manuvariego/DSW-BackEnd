import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeGarageInput, getAvailables, sanitizeGarageUpdate } from "./garage.controller.js";
import { validateGarageAvailables, validateAddGarage } from "./garage.validation.js";

export const GarageRouter = Router()

GarageRouter.get('/', findAll)
GarageRouter.get('/availables', validateGarageAvailables, getAvailables)
GarageRouter.get('/:cuit', findOne)
GarageRouter.post('/', validateAddGarage, sanitizeGarageInput, add)
GarageRouter.put('/:cuit', sanitizeGarageUpdate, update)
GarageRouter.delete('/:cuit', eliminate)
