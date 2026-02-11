import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationInput, findByUser, cancel, findAllofGarage, listResByGarage, getReservationsForBlocking, checkAvailability, updateServiceStatus } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const ReservationRouter = Router()

ReservationRouter.get('/garage/:cuitGarage', authenticate, listResByGarage)
ReservationRouter.get('/', authenticate, findAll)
ReservationRouter.get('/user/:userId', authenticate, findByUser)
ReservationRouter.get('/:id', authenticate, findOne)
ReservationRouter.get('/garage/:cuitGarage/:condition', authenticate, findAllofGarage)
ReservationRouter.post('/', authenticate, validateAddReservation, add)
ReservationRouter.put('/:id', authenticate, sanitizeReservationInput, update)
ReservationRouter.patch('/:id/cancel', authenticate, cancel)
ReservationRouter.patch('/:reservationId/services/:serviceId', authenticate, updateServiceStatus);
ReservationRouter.delete('/:id', authenticate, eliminate)
ReservationRouter.get('/blocking-data/:cuitGarage', authenticate, getReservationsForBlocking);
ReservationRouter.get('/check-availability', checkAvailability);
