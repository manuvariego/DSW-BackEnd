import { Router } from 'express'

import { findAll, findOne, add, update, remove, sanitizeLocationInput } from './location.controller.js'
// import { authenticate } from "../shared/middleware/auth.middleware.js";

export const LocationRouter = Router()

/**remove authenticate?**/
LocationRouter.get('/', findAll)
LocationRouter.get('/:id', findOne)
LocationRouter.post('/', sanitizeLocationInput, add)
LocationRouter.put('/:id', sanitizeLocationInput, update)
LocationRouter.delete('/:id', remove)
