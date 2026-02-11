import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationTypeInput, getPricingStatus, findByGarage } from "./reservationType.controller.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const ReservationTypeRouter = Router()

// Public GET endpoints (reference data for pricing, etc.)
ReservationTypeRouter.get('/', findAll)
ReservationTypeRouter.get('/garage/:cuit/status', getPricingStatus)
ReservationTypeRouter.get('/garage/:cuit', findByGarage)
ReservationTypeRouter.get('/:description/:cuitGarage', findOne)

// Protected CUD endpoints
ReservationTypeRouter.post('/', authenticate, sanitizeReservationTypeInput, add)
ReservationTypeRouter.put('/:description/:cuitGarage', authenticate, sanitizeReservationTypeInput, update)
ReservationTypeRouter.delete('/:description/:cuitGarage', authenticate, eliminate)