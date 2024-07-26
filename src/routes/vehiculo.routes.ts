import { Router } from "express";

import {findAll, findOne, update, add, eliminate, sanitizeVehiculoInput } from "../controllers/vehiculo.controller.js";

export const VehiculoRouter = Router()

VehiculoRouter.get('/', findAll)
VehiculoRouter.get('/:patente', findOne)
VehiculoRouter.post('/',sanitizeVehiculoInput  , add)
VehiculoRouter.put('/:id',sanitizeVehiculoInput  , update)
VehiculoRouter.delete('/:id', eliminate)
