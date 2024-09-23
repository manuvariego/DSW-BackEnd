import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeParkingSpaceInput } from "./parkingSpace.controller.js";

export const ParkingSpaceRouter = Router()

ParkingSpaceRouter.get('/', findAll)
ParkingSpaceRouter.get('/:number', findOne)
ParkingSpaceRouter.post('/', sanitizeParkingSpaceInput, add)
ParkingSpaceRouter.put('/:number', sanitizeParkingSpaceInput, update)
ParkingSpaceRouter.delete('/:number', eliminate)

