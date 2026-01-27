import { Request, Response, NextFunction } from "express";
import { Reservation } from "./reservation.entity.js";
import { orm } from "../shared/db/orm.js";
import { validationResult } from 'express-validator';
import { createReservationBusiness } from "./reservation.business.js";
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

    const reservation = await createReservationBusiness(checkin, checkout, licensePlate, cuitGarage, services, totalPrice);
    
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
    reservation.estado = 'cancelada' as any
    await em.flush()
    res.status(200).json({ message: 'Reserva cancelada', reservation })
  } catch (error: any) { handleError(error, res) }
}

async function findAllofGarage(req: Request, res: Response) {
  try {
    const cuitGarage = Number.parseInt(req.params.cuitGarage);
    const filters: any = {};

    if (req.query.license_plate) {
      filters.vehicle = { licensePlate: req.query.license_plate as string };
    }
    if (req.query.estado) {
      filters.estado = req.query.estado as string;
    }

    const filterCheckInDate = req.query.check_in_at ? new Date(req.query.check_in_at as string) : undefined;
    const filterCheckOutDate = req.query.check_out_at ? new Date(req.query.check_out_at as string) : undefined;

    if (filterCheckInDate && filterCheckOutDate) {
      // Filter reservations where the reservation's check_in_at is between the provided filter dates
      filters.check_in_at = {
        $gte: filterCheckInDate,
        $lte: filterCheckOutDate
      };
    } else if (filterCheckInDate) {
      // Filter reservations where the reservation's check_in_at is greater than or equal to the provided check_in_at
      filters.check_in_at = {
        $gte: filterCheckInDate
      };
    } else if (filterCheckOutDate) {
      // Filter reservations where the reservation's check_in_at is less than or equal to the provided check_out_at
      filters.check_in_at = {
        $lte: filterCheckOutDate
      };
    }
    filters.garage = { cuit: cuitGarage };

    const reservations = await em.find(Reservation, filters, {
        populate: ['services', 'vehicle', 'vehicle.owner'] 
    });

    if (req.params.condition === 'true') {


      const totalAmount = reservations.reduce((sum, item) => sum + Number(item.amount), 0);

      // 2. Return the response immediately with the total
      return res.json({
        totalRevenue: totalAmount
      });
    }

    res.status(200).json(reservations)
  } catch (error: any) { handleError(error, res) }
}


export { sanitizeReservationInput, findAll, findByUser, findOne, add, update, eliminate, findAllofGarage, cancel }
