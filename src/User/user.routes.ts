import { Router } from "express";

import { get_vehicles, login, findAll, findOne, update, add, eliminate, sanitizeUserInput } from "./user.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:id', findOne)
UserRouter.get('/:id/vehicles', get_vehicles)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.post('/login', login)
UserRouter.put('/:id', sanitizeUserInput, update)
UserRouter.delete('/:id', eliminate)
