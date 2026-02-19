import { Router } from 'express'
import { validateAddLocation } from './location.validation.js'
import { findAll, findOne, add, update, remove, sanitizeLocationInput } from './location.controller.js'

export const LocationRouter = Router()

LocationRouter.get('/', findAll)
LocationRouter.get('/:id', findOne)
LocationRouter.post('/', validateAddLocation, sanitizeLocationInput, add)
LocationRouter.put('/:id', sanitizeLocationInput, update)
LocationRouter.delete('/:id', remove)
