import { Router } from "express";

import { findAll, findOne, update, add, sanitizeUserInput, eliminate } from "./usuario.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:dni', findOne)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.put('/:dni', sanitizeUserInput, update)
UserRouter.patch('/:dni', sanitizeUserInput, update)
UserRouter.delete('/:dni', eliminate)