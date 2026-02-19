import { Router } from 'express'
import { validateAddVehicleType } from './vehicleType.validation.js'
import { add, eliminate, findAll, findOne, sanitizetypeVehicleInput, update } from './vehicleType.controller.js'

export const typeVehicleRouter = Router()

typeVehicleRouter.get('/', findAll)
typeVehicleRouter.get('/:id', findOne)
typeVehicleRouter.post('/', validateAddVehicleType, sanitizetypeVehicleInput, add)
typeVehicleRouter.put('/:id', sanitizetypeVehicleInput, update)
typeVehicleRouter.delete('/:id', eliminate)

