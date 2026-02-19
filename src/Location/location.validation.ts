import { body } from 'express-validator';

export const validateAddLocation = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),

  body('province')
    .notEmpty().withMessage('La provincia es obligatoria')
    .isString().withMessage('La provincia debe ser un texto'),
];