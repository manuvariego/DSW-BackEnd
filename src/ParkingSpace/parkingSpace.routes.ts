import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeParkingSpaceInput, findAllofAGarage } from "./parkingSpace.controller.js";

export const ParkingSpaceRouter = Router()

ParkingSpaceRouter.get('/', findAll)
ParkingSpaceRouter.get('/:number/:cuitGarage', findOne)
ParkingSpaceRouter.get('/:cuitGarage', findAllofAGarage)
ParkingSpaceRouter.post('/', sanitizeParkingSpaceInput, add)
ParkingSpaceRouter.put('/:number/:cuitGarage', sanitizeParkingSpaceInput, update)
ParkingSpaceRouter.delete('/:number/:cuitGarage', eliminate)

