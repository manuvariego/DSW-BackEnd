import { Router } from "express";

import { findAll, findOne, Update, add, sanitizeUserInput, Eliminate } from "./usuario.controller.js";

export const UserRouter = Router()

UserRouter.get('/', findAll)
UserRouter.get('/:dni', findOne)
UserRouter.post('/', sanitizeUserInput, add)
UserRouter.patch('/:dni', sanitizeUserInput, Update)
UserRouter.put('/:dni', sanitizeUserInput, Update)
UserRouter.delete('/:dni', Eliminate)