import { body } from 'express-validator';

export const validateAddUser = [
  body('dni')
    .notEmpty().withMessage('El DNI es obligatorio')
    .isString().withMessage('El DNI debe ser un texto')
    .isLength({ min: 7, max: 10 }).withMessage('El DNI debe tener entre 7 y 10 caracteres'),

  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('lastname')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isString().withMessage('El apellido debe ser un texto')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),

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
];