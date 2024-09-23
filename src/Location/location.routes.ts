import { Router } from 'express'

import { findAll, findOne, add, update, remove, sanitizeLocationInput } from './location.controller.js'

export const LocationRouter = Router()

LocationRouter.get('/', findAll)
LocationRouter.get('/:id', findOne)
LocationRouter.post('/', sanitizeLocationInput, add)
LocationRouter.put('/:id', sanitizeLocationInput, update)
LocationRouter.delete('/:id', remove)
