import { Router } from "express";

import {findAll, findOne, update, add, eliminate, sanitizeVehiculoInput } from "./vehiculo.controller.js";

export const VehiculoRouter = Router()

VehiculoRouter.get('/', findAll)
VehiculoRouter.get('/:patente', findOne)
VehiculoRouter.post('/', sanitizeVehiculoInput, add)
VehiculoRouter.put('/:patente', sanitizeVehiculoInput, update)
VehiculoRouter.delete('/:patente', eliminate)