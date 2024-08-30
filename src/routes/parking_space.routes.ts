import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeParking_spaceInput } from "../controllers/parking_space.controller.js";

export const Parking_spaceRouter = Router()

Parking_spaceRouter.get('/', findAll)
Parking_spaceRouter.get('/:number', findOne)
Parking_spaceRouter.post('/', sanitizeParking_spaceInput, add)
Parking_spaceRouter.put('/:number', sanitizeParking_spaceInput, update)
Parking_spaceRouter.delete('/:number', eliminate)

