import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationInput, findAllofGarage } from "./reservation.controller.js";
import { validateAddReservation } from "./reservation.validation.js";

export const ReservationRouter = Router()

ReservationRouter.get('/', findAll)
ReservationRouter.get('/:id',  findOne)
ReservationRouter.get('/garage/:cuitGarage/:condition', findAllofGarage)
ReservationRouter.post('/', validateAddReservation,  add)
ReservationRouter.put('/:id', sanitizeReservationInput, update)
ReservationRouter.delete('/:id', eliminate)
