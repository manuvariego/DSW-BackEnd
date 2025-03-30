import { Router } from "express";
import { auth } from "../middlewares/auth.js"

import { getVehicles, login, findAll, findOne, update, add, eliminate, sanitizeUserInput, getActiveReservations } from "./user.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:id', auth, findOne)
UserRouter.get('/:id/vehicles', auth, getVehicles)
UserRouter.get('/:id/reservations', auth, getActiveReservations)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.post('/login', login)
UserRouter.put('/:id', sanitizeUserInput, update)
UserRouter.delete('/:id', eliminate)
