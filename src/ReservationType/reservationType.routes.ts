import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationTypeInput, getPricingStatus, findByGarage } from "./reservationType.controller.js";

export const ReservationTypeRouter = Router()

ReservationTypeRouter.get('/', findAll)
ReservationTypeRouter.get('/garage/:cuit/status', getPricingStatus)
ReservationTypeRouter.get('/garage/:cuit', findByGarage)
ReservationTypeRouter.get('/:description/:cuitGarage', findOne)
ReservationTypeRouter.post('/', sanitizeReservationTypeInput, add)
ReservationTypeRouter.put('/:description/:cuitGarage', sanitizeReservationTypeInput, update)
ReservationTypeRouter.delete('/:description/:cuitGarage', eliminate)