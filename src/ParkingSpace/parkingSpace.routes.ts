import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeParkingSpaceInput } from "./parkingSpace.controller.js";

export const ParkingSpaceRouter = Router()

ParkingSpaceRouter.get('/', findAll)
ParkingSpaceRouter.get('/:number/:cuitGarage', findOne)
ParkingSpaceRouter.post('/', sanitizeParkingSpaceInput, add)
ParkingSpaceRouter.put('/:number/:cuitGarage', sanitizeParkingSpaceInput, update)
ParkingSpaceRouter.delete('/:number/:cuitGarage', eliminate)

