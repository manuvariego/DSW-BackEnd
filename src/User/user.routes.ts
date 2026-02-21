import { Router } from "express";
import { validateAddUser } from "./user.validation.js"

import { getVehicles, findAll, findOne, update, add, eliminate, sanitizeUserInput, sanitizeUserUpdate, getActiveReservations } from "./user.controller.js";
import { authenticate, authorizeUser } from "../shared/middleware/auth.middleware.js";

export const UserRouter = Router()

// Public routes
UserRouter.post('/', validateAddUser, sanitizeUserInput, add)

// Protected routes
UserRouter.get('/', authenticate, findAll)
UserRouter.get('/:id', authenticate, findOne)
UserRouter.get('/:id/vehicles', authenticate, getVehicles)
UserRouter.get('/:id/reservations', authenticate, getActiveReservations)
UserRouter.put('/:id', authenticate, authorizeUser, sanitizeUserUpdate, update)
UserRouter.delete('/:id', authenticate, authorizeUser, eliminate)