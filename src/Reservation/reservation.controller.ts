import { Request, Response, NextFunction } from "express";
import { Reservation } from "./reservation.entity.js";
import { orm } from "../shared/db/orm.js";
import { validationResult } from 'express-validator';
import { createReservationBusiness, getGarageReservationsBusiness } from "./reservation.business.js";
import { sendReservationEmail } from "../shared/mail.service.js";
import { handleError } from "../shared/errors/errorHandler.js";


const em = orm.em

function sanitizeReservationInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    date_time_reservation: req.body.date_time_reservation,
    check_in_at: req.body.check_in_at,
    check_out_at: req.body.check_out_at,
    estado: req.body.estado,
    amount: req.body.amount,
    vehicle: req.body.vehicle,
    garage: req.body.garage,
    parkingSpace: req.body.parkingSpace,
    paymentMethod: req.body.paymentMethod
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request, res: Response) {
  try {
    const reservations = await em.find(Reservation, {})
    res.status(200).json(reservations)
  } catch (error: any) { handleError(error, res) }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reservation = await em.findOneOrFail(Reservation, { id })
    res.status(200).json(reservation)
  } catch (error: any) { handleError(error, res) }
}


async function findByUser(req: Request, res: Response) {
  try {
    const userId = Number.parseInt(req.params.userId);
    const reservations = await em.find(
      Reservation,
      { vehicle: { owner: { id: userId } } },
      { populate: ['vehicle', 'garage', 'garage.location', 'parkingSpace', 'services'] }
    );
    res.status(200).json(reservations);
  } catch (error: any) { handleError(error, res) }
}


async function add(req: Request, res: Response) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkin = new Date(`${req.body.check_in_at}`);
    const checkout = new Date(`${req.body.check_out_at}`);
    const licensePlate = `${req.body.license_plate}`;
    const cuitGarage = +(`${req.body.cuitGarage}`);
    const servicesObject = req.body.services || {};
    const services = Object.values(servicesObject).map(id => Number(id));
    const totalPrice = req.body.totalPrice || 0;
    const paymentMethod: string = req.body.paymentMethod;

    const reservation = await createReservationBusiness(checkin, checkout, licensePlate, cuitGarage, services, totalPrice, paymentMethod);
    
    if (!reservation) {
      return res.status(400).json({ 
        message: 'No se pudo crear la reserva.' 
      });
    }

    const fullReservation = await em.findOne(Reservation, { id: reservation.id }, {
      populate: ['vehicle.owner', 'garage']
    });

    if (fullReservation && fullReservation.vehicle && fullReservation.vehicle.owner) {
      const userEmail = fullReservation.vehicle.owner.email;
      await sendReservationEmail(userEmail, fullReservation);
    }

    res.status(200).json(reservation);

  } catch (error: any) { handleError(error, res) }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reservationToUpdate = await em.findOneOrFail(Reservation, { id })
    em.assign(reservationToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json(reservationToUpdate)
  } catch (error: any) { handleError(error, res) }
}


async function eliminate(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reservation = em.getReference(Reservation, id)
    await em.removeAndFlush(reservation)
    res.status(200).json({ message: 'Reserva eliminada' })
  } catch (error: any) { handleError(error, res) }
}

async function cancel(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reservation = await em.findOneOrFail(Reservation, { id })

    const fechaActual = new Date(); 
    const fechaIngreso = new Date(reservation.check_in_at); 

    if (fechaActual >= fechaIngreso) {
      return res.status(400).json({ 
        message: 'No se puede cancelar: La reserva ya comenzó o es una fecha pasada.' 
      });
    }

    if (reservation.estado === 'cancelada') {
      return res.status(400).json({ message: 'La reserva ya se encuentra cancelada.' });
    }
    reservation.estado = 'cancelada' as any
    
    await em.flush()
    
    res.status(200).json({ message: 'Reserva cancelada', reservation })

  } catch (error: any) { 
    handleError(error, res) 
  }
}

async function findAllofGarage(req: Request, res: Response) {
  try {
    const cuitGarage = Number.parseInt(req.params.cuitGarage);
    const { condition } = req.params;
    
    // We pass req.query to the business layer
    const result = await getGarageReservationsBusiness(cuitGarage, req.query, condition);

    res.status(200).json(result);
  } catch (error: any) { 
    handleError(error, res); 
  }
}

async function listResByGarage(req: Request, res: Response) {
  try {
    const cuitGarage = Number.parseInt(req.params.cuitGarage);

    const reservations = await em.find(Reservation, 
      { 
        garage: { cuit: cuitGarage },
      }, 
      {
        populate: ['parkingSpace', 'services', 'vehicle'] 
      }
    );

    res.status(200).json(reservations);
  } catch (error: any) { 
    handleError(error, res); 
  }
}

async function getReservationsForBlocking(req: Request, res: Response) {
  try {
    const cuitGarage = Number.parseInt(req.params.cuitGarage);

    // Buscamos reservas de este garage con sus servicios
    const reservations = await em.find(Reservation, 
      { 
        garage: { cuit: cuitGarage },
      }, 
      { 
        populate: ['services'] 
      }
    );

    res.status(200).json(reservations);
  } catch (error: any) { 
    handleError(error, res); 
  }
}

export { sanitizeReservationInput, findAll, findByUser, findOne, add, update, eliminate, findAllofGarage, cancel, listResByGarage, getReservationsForBlocking }
