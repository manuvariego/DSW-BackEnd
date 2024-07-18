import { Router } from "express";

import { sanitizeUserInput, addUser} from "./usuario.controller.js";

export const UserRouter = Router()

//UserRouter.get('/', findAll)
//UserRouter.get('/:id', findOne)
UserRouter.post('/', sanitizeUserInput, addUser)
//UserRouter.put('/:id', sanitizeUserInput, update)
//UserRouter.delete('/:id', eliminate)
