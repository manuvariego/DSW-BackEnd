import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeCocheraInput } from "./cochera.controller.js";

export const CocheraRouter = Router()

CocheraRouter.get('/', findAll)
CocheraRouter.get('/:cuit', findOne)
CocheraRouter.post('/', sanitizeCocheraInput, add)
CocheraRouter.put('/:cuit', sanitizeCocheraInput, update)
CocheraRouter.delete('/:cuit', eliminate)