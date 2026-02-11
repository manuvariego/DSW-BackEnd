import { Router } from "express";

import { getVehicles, findAll, findOne, update, add, eliminate, sanitizeUserInput, getActiveReservations } from "./user.controller.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const UserRouter = Router()

// Public routes
UserRouter.post('/', sanitizeUserInput, add)

// Protected routes
UserRouter.get('/', authenticate, findAll)
UserRouter.get('/:id', authenticate, findOne)
UserRouter.get('/:id/vehicles', authenticate, getVehicles)
UserRouter.get('/:id/reservations', authenticate, getActiveReservations)
UserRouter.put('/:id', authenticate, sanitizeUserInput, update)
UserRouter.delete('/:id', authenticate, eliminate)