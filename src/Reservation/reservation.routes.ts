import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationInput, findByUser, cancel, findAllofGarage, listResByGarage, updateServiceStatus, checkAvailability, getReservationsForBlocking } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const ReservationRouter = Router()

ReservationRouter.get('/garage/:cuitGarage', listResByGarage)
ReservationRouter.get('/', findAll)
ReservationRouter.get('/user/:userId', findByUser)
ReservationRouter.get('/:id', findOne)
ReservationRouter.get('/garage/:cuitGarage/:condition', findAllofGarage)
ReservationRouter.post('/', validateAddReservation, add)
ReservationRouter.put('/:id', sanitizeReservationInput, update)
ReservationRouter.patch('/:id/cancel', cancel)
ReservationRouter.patch('/:reservationId/services/:serviceId', updateServiceStatus);
ReservationRouter.delete('/:id', eliminate)
ReservationRouter.get('/blocking-data/:cuitGarage', getReservationsForBlocking);
ReservationRouter.get('/check-availability', checkAvailability);
