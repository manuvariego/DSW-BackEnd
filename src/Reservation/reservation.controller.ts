import { Request, Response, NextFunction } from "express";
import { Reservation, ReservationStatus } from "./reservation.entity.js";
import { ReservationService } from "./reservationService.entity.js";
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
      { populate: ['vehicle', 'garage', 'garage.location', 'parkingSpace', 'reservationServices', 'reservationServices.service'] }
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

    // validación para que no reserve un vehículo que ya tiene una reserva activa en ese rango de fechas

    const newCheckIn = new Date(req.body.check_in_at);
    const newCheckOut = new Date(req.body.check_out_at);
    const plate = req.body.license_plate;

    const existeSuperposicion = await em.findOne(Reservation, {
      vehicle: { license_plate: plate }, 
      estado: { $in: [ReservationStatus.ACTIVE, ReservationStatus.IN_PROGRESS] },  
      $and: [
        { check_in_at: { $lt: newCheckOut } },
        { check_out_at: { $gt: newCheckIn } }
      ]
    });

    if (existeSuperposicion) {
      return res.status(400).json({ 
        message: `El vehículo ${plate} ya tiene una reserva activa en este rango de fechas: del ${new Date(existeSuperposicion.check_in_at).toLocaleDateString()} al ${new Date(existeSuperposicion.check_out_at).toLocaleDateString()}` 
      });
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

    if (reservation.estado === ReservationStatus.IN_PROGRESS) {
      return res.status(400).json({ 
        message: 'No se puede cancelar: La reserva está en curso.' 
      });
    }

    if (reservation.estado === ReservationStatus.CANCELLED) {
      return res.status(400).json({ message: 'La reserva ya se encuentra cancelada.' });
    }

    if (reservation.estado === ReservationStatus.COMPLETED) {
      return res.status(400).json({ message: 'La reserva ya está completada.' });
    }

    reservation.estado = ReservationStatus.CANCELLED;
    
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
      { populate: ['parkingSpace', 'reservationServices', 'reservationServices.service', 'vehicle'] }
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
      { populate: ['reservationServices', 'reservationServices.service'] }
    );

    res.status(200).json(reservations);
  } catch (error: any) { 
    handleError(error, res); 
  }
}

async function checkAvailability(req: Request, res: Response) {
  try {
    const { license_plate, check_in_at, check_out_at } = req.query;

    if (!license_plate || !check_in_at || !check_out_at) {
      return res.status(400).json({ message: 'Faltan datos para validar.' });
    }

    const newCheckIn = new Date(String(check_in_at));
    const newCheckOut = new Date(String(check_out_at));
    const plate = String(license_plate);

    // Misma lógica de superposición que en el add
    const conflict = await em.findOne(Reservation, {
    vehicle: { license_plate: plate }, 
    estado: { $in: [ReservationStatus.ACTIVE, ReservationStatus.IN_PROGRESS] },  
      $and: [
        { check_in_at: { $lt: newCheckOut } },
        { check_out_at: { $gt: newCheckIn } }
      ]
    });

    if (conflict) {
      return res.status(200).json({ 
        available: false, 
        message: `El vehículo ${plate} ya tiene una reserva del ${new Date(conflict.check_in_at).toLocaleDateString()} al ${new Date(conflict.check_out_at).toLocaleDateString()}` 
      });
    }

    return res.status(200).json({ available: true, message: 'Disponible' });

  } catch (error: any) { handleError(error, res) }
}

async function updateServiceStatus(req: Request, res: Response) {
  try {
      const reservationId = Number.parseInt(req.params.reservationId);
      const serviceId = Number.parseInt(req.params.serviceId);
      const { status } = req.body;

      const validStatuses = ['pendiente', 'en_progreso', 'completado'];
      if (!validStatuses.includes(status)) {
          return res.status(400).json({
              message: 'Status inválido. Debe ser: pendiente, en_progreso o completado'
          });
      }

      const reservationService = await em.findOneOrFail(ReservationService, {
          reservation: reservationId,
          service: serviceId
      });

      reservationService.status = status;
      await em.flush();

      res.status(200).json(reservationService);
  } catch (error: any) {
      handleError(error, res);
  }
}


export { sanitizeReservationInput, findAll, findByUser, findOne, add, update, eliminate, findAllofGarage, cancel, listResByGarage, getReservationsForBlocking, checkAvailability, updateServiceStatus }
