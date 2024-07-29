import { Router } from "express";

import {findAll, findOne, get_vehiculos ,update, add, eliminate, sanitizeVehiculoInput } from "../controllers/vehiculo.controller.js";

export const VehiculoRouter = Router()

VehiculoRouter.get('/', findAll)
VehiculoRouter.get('/:patente', findOne)
VehiculoRouter.get('/:userid/vehiculos', get_vehiculos)
VehiculoRouter.post('/',sanitizeVehiculoInput  , add)
VehiculoRouter.put('/:id',sanitizeVehiculoInput  , update)
VehiculoRouter.delete('/:id', eliminate)
