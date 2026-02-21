import { Router } from 'express'
import { validateAddVehicleType } from './vehicleType.validation.js'
import { add, eliminate, findAll, findOne, sanitizetypeVehicleInput, update } from './vehicleType.controller.js'
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const typeVehicleRouter = Router()

// Public GET endpoints (reference data for dropdowns, etc.)
typeVehicleRouter.get('/', findAll)
typeVehicleRouter.get('/:id', findOne)

// Protected CUD endpoints
typeVehicleRouter.post('/', authenticate, validateAddVehicleType, sanitizetypeVehicleInput, add)
typeVehicleRouter.put('/:id', authenticate, sanitizetypeVehicleInput, update)
typeVehicleRouter.delete('/:id', authenticate, eliminate)

