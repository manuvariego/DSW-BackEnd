import { Router } from "express";

import { sanitizeUserInput, findAll, findOne, update, add, eliminate } from "./user.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:id', findOne)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.put('/:id', sanitizeUserInput, update)
UserRouter.delete('/:id', eliminate)
