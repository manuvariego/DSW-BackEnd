import { Router } from "express";

import { getVehicles, getReservations, login, findAll, findOne, update, add, eliminate, sanitizeUserInput } from "./user.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:id', findOne)
UserRouter.get('/:id/vehicles', getVehicles)
UserRouter.get('/:id/reservations', getReservations)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.post('/login', login)
UserRouter.put('/:id', sanitizeUserInput, update)
UserRouter.delete('/:id', eliminate)
