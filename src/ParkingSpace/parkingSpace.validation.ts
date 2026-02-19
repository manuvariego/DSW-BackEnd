import { body } from 'express-validator';

export const validateAddParkingSpace = [
  body('number')
    .notEmpty().withMessage('El número es obligatorio')
    .isInt({ min: 1 }).withMessage('El número debe ser un entero mayor a 0'),

  body('garage')
    .notEmpty().withMessage('La cochera es obligatoria'),

  body('TypeVehicle')
    .notEmpty().withMessage('El tipo de vehículo es obligatorio'),
];