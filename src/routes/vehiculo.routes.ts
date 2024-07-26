import { Router } from "express";

import {findAll, findOne, update, add, eliminate, sanitizeUserInput } from "../controllers/vehiculo.controller.js";

export const VehiculoRouter = Router()

VehiculoRouter.get('/', findAll)
VehiculoRouter.get('/:patente', findOne)
VehiculoRouter.post('/', sanitizeUserInput, add)
VehiculoRouter.put('/:id', sanitizeUserInput, update)
VehiculoRouter.delete('/:id', eliminate)
