import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationInput } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";

export const ReservationRouter = Router()

ReservationRouter.get('/', findAll)
ReservationRouter.get('/:id', findOne)
ReservationRouter.post('/', validateAddReservation,  add)
ReservationRouter.put('/:id', sanitizeReservationInput, update)
ReservationRouter.delete('/:id', eliminate)
