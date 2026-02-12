import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationInput, findByUser, cancel, findAllofGarage, listResByGarage, updateServiceStatus } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";

export const ReservationRouter = Router()

ReservationRouter.get('/', findAll)
ReservationRouter.get('/check-availability', checkAvailability)
ReservationRouter.get('/blocking-data/:cuitGarage', getReservationsForBlocking)
ReservationRouter.get('/user/:userId', findByUser)
ReservationRouter.get('/garage/:cuitGarage', listResByGarage)
ReservationRouter.get('/garage/:cuitGarage/:condition', findAllofGarage)
ReservationRouter.get('/:id', findOne)
ReservationRouter.post('/', validateAddReservation, add)
ReservationRouter.put('/:id', sanitizeReservationInput, update)
ReservationRouter.patch('/:id/cancel', cancel)
ReservationRouter.patch('/:reservationId/services/:serviceId', updateServiceStatus)
ReservationRouter.delete('/:id', eliminate)
