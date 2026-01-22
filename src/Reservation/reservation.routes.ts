import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationInput, findByUser, cancel, findAllofGarage } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";

export const ReservationRouter = Router()

ReservationRouter.get('/', findAll)
ReservationRouter.get('/user/:userId', findByUser)
ReservationRouter.get('/:id', findOne)
ReservationRouter.get('/garage/:cuitGarage/:condition', findAllofGarage)
ReservationRouter.post('/', validateAddReservation, add)
ReservationRouter.put('/:id', sanitizeReservationInput, update)
ReservationRouter.patch('/:id/cancel', cancel)
ReservationRouter.delete('/:id', eliminate)
