import { Router } from "express";

import { sanitizeUserInput, findAll, findOne, update, add, eliminate } from "./garage.controller.js";

export const GarageRouter = Router()

GarageRouter.get('/', findAll)
GarageRouter.get('/:id', findOne)
GarageRouter.post('/', sanitizeUserInput, add)
GarageRouter.put('/:id', sanitizeUserInput, update)
GarageRouter.delete('/:id', eliminate)
