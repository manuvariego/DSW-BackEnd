import { query } from 'express-validator';

export const validateGarageAvailables = [
  query('check_out_at').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.query?.check_in_at)) {
      return false;
    }
    return true;
  }).withMessage(`Check-out debe ser menor al check-in`)
];