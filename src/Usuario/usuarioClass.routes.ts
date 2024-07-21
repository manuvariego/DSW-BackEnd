import { Router } from "express";

import {findAll, findOne, update, add, eliminate } from "./usuarioClass.controller.js";

export const UserClassRouter = Router()

UserClassRouter.get('/', findAll)
UserClassRouter.get('/:id', findOne)
UserClassRouter.post('/', add)
UserClassRouter.put('/:id', update)
UserClassRouter.delete('/:id', eliminate)