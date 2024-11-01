import { query } from 'express-validator';

export const validateGarageAvailables = [
  query('check_out_at')
    .notEmpty().withMessage(`El campo check-out es obligatorio`)
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.query?.check_in_at)) {
        return false;
      }
      return true;
    }).withMessage(`Check-out debe ser menor al check-in`),
  query('check_in_at')
    .notEmpty().withMessage(`El campo check-in es obligatorio`)
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        return false;
      }
      return true;
    }).withMessage(`Check-in debe ser mayor a hoy`),
  query('license_plate')
    .notEmpty().withMessage(`El campo patente es obligatorio`)
];