import { Request, Response, NextFunction } from "express";
import { Reservation } from "./reservation.entity.js";
//import { Vehicle } from "../Vehicle/vehicle.entity.js";
import { orm } from "../shared/db/orm.js";
//import { ParkingSpace } from "../ParkingSpace/parkingSpace.entity.js";
import { validationResult } from 'express-validator';
import { createReservationBusiness } from "./reservation.business.js";


const em = orm.em

function sanitizeReservationInput(req: Request, res: Response, next: NextFunction) {
    console.log('pasa por aca');
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
        console.log(reservations)

        res.status(200).json(reservations)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const reservation = await em.findOneOrFail(Reservation, { id })

        res.status(200).json(reservation)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        //Capturamos los posibles errores que hayan surgido en el validation.ts
        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            // Si hay errores, devolver un error 400 con los detalles. 
            return res.status(400).json({ errors: errors.array() });
        }

        const checkin = new Date(`${req.body.check_in_at}`);
        const checkout = new Date(`${req.body.check_out_at}`);
        const licensePlate = `${req.body.license_plate}`;
        const cuitGarage = +(`${req.body.cuitGarage}`);

        const reservation = await createReservationBusiness(checkin, checkout, licensePlate, cuitGarage);
        
        res.status(200).json(reservation);

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const reservationToUpdate = await em.findOneOrFail(Reservation, { id })
        em.assign(reservationToUpdate, req.body.sanitizedInput)
        await em.flush()

        res.status(200).json(reservationToUpdate)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const reservation = em.getReference(Reservation, id)
        await em.removeAndFlush(reservation)

        res.status(200).json({ message: 'Reserva eliminada' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

export { sanitizeReservationInput, findAll, findOne, add, update, eliminate }
