import { Router } from "express";

import { findAll, findOne, update, add, sanitizeUserInput } from "./cochera.controller.js";

export const CocheraRouter = Router()

CocheraRouter.get('/', findAll)
CocheraRouter.get('/:id', findOne)
CocheraRouter.post('/', sanitizeUserInput, add)
CocheraRouter.put('/:id', sanitizeUserInput, update)
//CocheraRouter.delete('/:id', eliminate)
