import { body } from 'express-validator';

export const validateAddReservation = [
    body().custom((value, { req }) => {
    const checkInDate = new Date(req.body.check_in_at);
    const checkOutDate = new Date(req.body.check_out_at);
    const currentDate = new Date();

    // Validar que el check-in sea mayor a la fecha actual
    if (checkInDate <= currentDate) {
      throw new Error('Check-in debe ser mayor a la fecha actual');
    }

    // Validar que el check-out sea mayor al check-in
    if (checkOutDate <= checkInDate) {
      throw new Error('Check-out debe ser mayor al check-in');
    }

    return true;  // Si ambas validaciones son correctas, retorna true
  })
];
