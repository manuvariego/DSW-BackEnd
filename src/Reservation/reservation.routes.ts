import { Router } from "express";

import { findAll, findOne, add, eliminate, findByUser, cancel, findAllofGarage, listResByGarage, getReservationsForBlocking, checkAvailability, updateServiceStatus } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";
import { authenticate, authorizeUser, authorizeGarage } from "../shared/middleware/auth.middleware.js";

export const ReservationRouter = Router()

ReservationRouter.get('/check-availability', checkAvailability)
ReservationRouter.get('/blocking-data/:cuitGarage', authenticate, authorizeGarage, getReservationsForBlocking)
ReservationRouter.get('/user/:userId', authenticate, authorizeUser, findByUser)
ReservationRouter.get('/garage/:cuitGarage/:condition', authenticate, authorizeGarage, findAllofGarage)
ReservationRouter.get('/garage/:cuitGarage', authenticate, authorizeGarage, listResByGarage)
ReservationRouter.get('/', authenticate, findAll)
ReservationRouter.get('/:id', authenticate, findOne)
ReservationRouter.post('/', authenticate, authorizeUser, validateAddReservation, add)
ReservationRouter.patch('/:id/cancel', authenticate, authorizeUser, cancel)
ReservationRouter.patch('/:reservationId/services/:serviceId', authenticate, authorizeGarage, updateServiceStatus)
ReservationRouter.delete('/:id', authenticate, eliminate)