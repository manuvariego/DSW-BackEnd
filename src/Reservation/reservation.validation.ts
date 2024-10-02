import { body } from 'express-validator';

export const validateAddReservation = [
  body('check_out_at').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.check_in_at)) {
      return false;
    }
    return true;
  }).withMessage('Check-out debe ser menor al check-in')
];