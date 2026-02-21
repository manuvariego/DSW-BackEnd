import { body } from 'express-validator';

export const validateAddReservationType = [
  body('description')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isIn(['HOUR', 'HALF_DAY', 'DAY', 'WEEKLY', 'HALF_MONTH', 'MONTH'])
    .withMessage('La descripción debe ser HOUR, HALF_DAY, DAY, WEEKLY, HALF_MONTH o MONTH'),

  body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isNumeric().withMessage('El precio debe ser numérico')
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error('El precio no puede ser negativo');
      }
      return true;
    }),

  body('garage')
    .notEmpty().withMessage('La cochera es obligatoria'),
];