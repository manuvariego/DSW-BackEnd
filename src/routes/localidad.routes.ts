import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeLocalidadInput } from '../controllers/localidad.controller.js'

export const LocalidadRouter = Router()

LocalidadRouter.get('/', findAll)
LocalidadRouter.get('/:id', findOne)
LocalidadRouter.post('/', sanitizeLocalidadInput, add)
LocalidadRouter.put('/:id', sanitizeLocalidadInput, update)
LocalidadRouter.delete('/:id', remove)
