import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './localidad.controller.js'

export const LocalidadRouter = Router()

LocalidadRouter.get('/', findAll)
LocalidadRouter.get('/:id', findOne)
LocalidadRouter.post('/', add)
LocalidadRouter.put('/:id', update)
LocalidadRouter.delete('/:id', remove)