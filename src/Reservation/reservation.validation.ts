import { body } from 'express-validator';

export const validateAddReservation = [
    body().custom((value, { req }) => {
        const checkInDate = new Date(req.body.check_in_at);
        const checkOutDate = new Date(req.body.check_out_at);
        const currentDate = new Date();

        if (checkInDate <= currentDate) {
          throw new Error('Check-in debe ser mayor a la fecha actual');
        }

        if (checkOutDate <= checkInDate) {
          throw new Error('Check-out debe ser mayor al check-in');
        }

        return true;
    }),
    
    body('license_plate')
        .notEmpty().withMessage('La patente es obligatoria')
        .isString().withMessage('La patente debe ser un texto'),

    body('cuitGarage')
        .notEmpty().withMessage('El CUIT de la cochera es obligatorio'),

    body('totalPrice')
        .notEmpty().withMessage('El precio total es obligatorio')
        .isNumeric().withMessage('El precio total debe ser numérico')
        .custom((value) => {
            if (Number(value) < 0) {
                throw new Error('El precio total no puede ser negativo');
            }
            return true;
        }),

    body('paymentMethod')
        .notEmpty().withMessage('El método de pago es obligatorio')
        .isIn(['CASH', 'MP']).withMessage('El método de pago debe ser Efectivo o MP'),
];
