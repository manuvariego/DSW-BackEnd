import { Router } from "express";

import {findAll, findOne, update, add, eliminate } from "./itemUser.controller.js";

export const ItemUserRouter = Router()

ItemUserRouter.get('/', findAll)
ItemUserRouter.get('/:id', findOne)
ItemUserRouter.post('/', add)
ItemUserRouter.put('/:id', update)
ItemUserRouter.delete('/:id', eliminate)