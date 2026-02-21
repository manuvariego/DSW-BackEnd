import { query, body } from 'express-validator';

export const validateGarageAvailables = [
  query('check_out_at')
    .notEmpty().withMessage(`El campo check-out es obligatorio`)
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.query?.check_in_at)) {
        return false;
      }
      return true;
    }).withMessage(`Check-out debe ser mayor al check-in`),
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

export const validateAddGarage = [
  body('cuit')
    .notEmpty().withMessage('El CUIT es obligatorio')
    .isNumeric().withMessage('El CUIT debe ser numérico')
    .isLength({ min: 11, max: 11 }).withMessage('El CUIT debe tener 11 dígitos'),

  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido'),

  body('address')
    .notEmpty().withMessage('La dirección es obligatoria')
    .isString().withMessage('La dirección debe ser un texto'),

  body('phoneNumber')
    .notEmpty().withMessage('El teléfono es obligatorio')
    .isString().withMessage('El teléfono debe ser un texto'),

  body('location')
    .notEmpty().withMessage('La ubicación es obligatoria'),
];