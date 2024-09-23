import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeGarageInput } from "./garage.controller.js";

export const GarageRouter = Router()

GarageRouter.get('/', findAll)
GarageRouter.get('/:cuit', findOne)
GarageRouter.post('/', sanitizeGarageInput, add)
GarageRouter.put('/:cuit', sanitizeGarageInput, update)
GarageRouter.delete('/:cuit', eliminate)
