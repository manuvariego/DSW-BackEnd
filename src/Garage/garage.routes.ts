import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeGarageInput, getAvailables } from "./garage.controller.js";
import { validateGarageAvailables } from "./garage.validation.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const GarageRouter = Router()

// Public routes
GarageRouter.post('/', sanitizeGarageInput, add)
GarageRouter.get('/', findAll)
GarageRouter.get('/availables', validateGarageAvailables, getAvailables)
GarageRouter.get('/:cuit', findOne)

// Protected routes
GarageRouter.put('/:cuit', authenticate, sanitizeGarageInput, update)
GarageRouter.delete('/:cuit', authenticate, eliminate)
