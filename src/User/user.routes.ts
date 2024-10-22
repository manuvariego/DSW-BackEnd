import { Router } from "express";

import { getVehicles, login, findAll, findOne, update, add, eliminate, sanitizeUserInput, getActiveReservations } from "./user.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:id', findOne)
UserRouter.get('/:id/vehicles', getVehicles)
UserRouter.get('/:id/reservations', getActiveReservations)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.post('/login', login)
UserRouter.put('/:id', sanitizeUserInput, update)
UserRouter.delete('/:id', eliminate)
