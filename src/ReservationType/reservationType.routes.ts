import { Router } from "express";

import { findAll, findOne, update, add, eliminate, sanitizeReservationTypeInput } from "./reservationType.controller.js";

export const ReservationTypeRouter = Router()

ReservationTypeRouter.get('/', findAll)
ReservationTypeRouter.get('/:id', findOne)
ReservationTypeRouter.post('/', sanitizeReservationTypeInput, add)
ReservationTypeRouter.put('/:id', sanitizeReservationTypeInput, update)
ReservationTypeRouter.delete('/:id', eliminate)
