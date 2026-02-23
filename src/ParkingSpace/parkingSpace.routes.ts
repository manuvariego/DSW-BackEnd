import { Router } from "express";
import { validateAddParkingSpace } from './parkingSpace.validation.js'
import { findAll, findOne, update, add, eliminate, sanitizeParkingSpaceInput, findAllofAGarage } from "./parkingSpace.controller.js";
import { authenticate, authorizeGarage } from "../shared/middleware/auth.middleware.js";

export const ParkingSpaceRouter = Router()

ParkingSpaceRouter.get('/', authenticate, findAll)
ParkingSpaceRouter.get('/:number/:cuitGarage', authenticate, findOne)
ParkingSpaceRouter.get('/:cuitGarage', authenticate, findAllofAGarage)
ParkingSpaceRouter.post('/', authenticate, authorizeGarage, validateAddParkingSpace, sanitizeParkingSpaceInput, add)
ParkingSpaceRouter.put('/:number/:cuitGarage', authenticate, authorizeGarage, sanitizeParkingSpaceInput, update)
ParkingSpaceRouter.delete('/:number/:cuitGarage', authenticate, authorizeGarage, eliminate)