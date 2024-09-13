import { Request, Response, NextFunction } from "express";
import { Reservation } from "../entities/reservation.entity.js";
import { Vehicle } from "../entities/vehicle.entity.js";
import { orm } from "../shared/db/orm.js";
import { Parking_space } from "../entities/parking_space.entity.js";


const em = orm.em

function sanitizeReservationInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    date_time_reservation: req.body.date_time_reservation,
    check_in_at: req.body.check_in_at,
    check_out_at: req.body.check_out_at,
    estado: req.body.estado,
    amount: req.body.amount,
    parking_space: req.body.parking_space
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request ,res: Response){
  try { 
    const reservations = await em.find(Reservation, {})

    res.status(200).json(reservations)

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function findOne(req: Request ,res: Response){
  try {  
    const id = Number.parseInt(req.params.id)
    const reservation = await em.findOneOrFail(Reservation, {id})

    res.status(200).json(reservation)

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function add(req: Request, res: Response) {
  try {
    const reservation = em.create(Reservation, req.body.sanitizedInput)
    await em.persistAndFlush(reservation)

    res.status(200).json(reservation)

  } catch (error: any) { res.status(500).json({ message: error.message }) }
}

/*
async function get_vehicles(req: Request ,res: Response){
  try {  
    const id = Number.parseInt(req.params.id)
    const vehicles = await em.find(Vehicle, {owner:  id})
    console.log(vehicles)

    res.status(200).json(vehicles)

  } catch (error:any){res.status(500).json({message: error.message})}
} */

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reservationToUpdate = await em.findOneOrFail(Reservation, { id })
    em.assign(reservationToUpdate, req.body.sanitizedInput)
    await em.flush()

    res.status(200).json(reservationToUpdate)

  } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request ,res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const reservation = em.getReference(Reservation, id)
    await em.removeAndFlush(reservation)

    res.status(200).json({message: 'Reserva eliminada'})

  } catch (error:any){res.status(500).json({message: error.message})}
}

export {sanitizeReservationInput, findAll, findOne, add, update, eliminate }
