import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeParkingSpaceInput, findAllofAGarage } from "./parkingSpace.controller.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const ParkingSpaceRouter = Router()

ParkingSpaceRouter.get('/', authenticate, findAll)
ParkingSpaceRouter.get('/:number/:cuitGarage', authenticate, findOne)
ParkingSpaceRouter.get('/:cuitGarage', authenticate, findAllofAGarage)
ParkingSpaceRouter.post('/', authenticate, sanitizeParkingSpaceInput, add)
ParkingSpaceRouter.put('/:number/:cuitGarage', authenticate, sanitizeParkingSpaceInput, update)
ParkingSpaceRouter.delete('/:number/:cuitGarage', authenticate, eliminate)

