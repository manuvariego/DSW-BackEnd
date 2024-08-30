import { Router } from "express";

import {findAll, findOne, update, add, eliminate, sanitizeTipoEstadiaInput } from "../controllers/tipo_estadia.controller.js";

export const TipoEstadiaRouter = Router()

TipoEstadiaRouter.get('/', findAll)
TipoEstadiaRouter.get('/:tipoE', findOne)
TipoEstadiaRouter.post('/', sanitizeTipoEstadiaInput  , add)
TipoEstadiaRouter.put('/:tipoE', sanitizeTipoEstadiaInput  , update)
TipoEstadiaRouter.delete('/:tipoE', eliminate)