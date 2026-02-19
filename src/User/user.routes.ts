import { Router } from "express";
import { validateAddUser } from "./user.validation.js"

import { getVehicles, findAll, findOne, update, add, eliminate, sanitizeUserInput, sanitizeUserUpdate, getActiveReservations } from "./user.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:id', findOne)
UserRouter.get('/:id/vehicles', getVehicles)
UserRouter.get('/:id/reservations', getActiveReservations)
UserRouter.post('/', validateAddUser, sanitizeUserInput, add)
UserRouter.put('/:id', sanitizeUserUpdate, update)
UserRouter.delete('/:id', eliminate)