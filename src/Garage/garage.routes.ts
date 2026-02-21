import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeGarageInput, getAvailables, sanitizeGarageUpdate } from "./garage.controller.js";
import { validateGarageAvailables, validateAddGarage } from "./garage.validation.js";
import { authenticate, authorizeGarage } from "../shared/middleware/auth.middleware.js";

export const GarageRouter = Router()

// Public routes
GarageRouter.post('/', validateAddGarage, sanitizeGarageInput, add)
GarageRouter.get('/', findAll)
GarageRouter.get('/availables', validateGarageAvailables, getAvailables)
GarageRouter.get('/:cuit', findOne)

GarageRouter.put('/:cuit', authenticate, authorizeGarage, sanitizeGarageUpdate, update)
GarageRouter.delete('/:cuit', authenticate, authorizeGarage, eliminate)