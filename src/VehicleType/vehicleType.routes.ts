import { Router } from 'express'

import { add, eliminate, findAll, findOne, sanitizetypeVehicleInput, update } from './vehicleType.controller.js'

export const typeVehicleRouter = Router()

typeVehicleRouter.get('/', findAll)
typeVehicleRouter.get('/:id', findOne)
typeVehicleRouter.post('/', sanitizetypeVehicleInput, add)
typeVehicleRouter.put('/:id', sanitizetypeVehicleInput, update)
typeVehicleRouter.delete('/:id', eliminate)

