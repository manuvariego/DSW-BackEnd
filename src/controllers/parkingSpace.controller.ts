import { Request, Response, NextFunction } from "express";
import { ParkingSpace } from "../entities/parkingSpace.entity.js";
import { orm } from "../shared/db/orm.js";
import { Reservation } from "../entities/reservation.entity.js";


const em = orm.em

function sanitizeParkingSpaceInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    number: req.body.number,
    garage: req.body.garage,
    reservation: req.body.reservation
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
    const parkingSpaces = await em.find(ParkingSpace, {},)
    res.status(201).json(parkingSpaces)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}



async function findOne(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.number)
    const parkingSpace = await em.findOneOrFail(ParkingSpace, { number })
    res.status(201).json(parkingSpace)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
  try {
    const parkingSpace = em.create(ParkingSpace, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json(parkingSpace)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.number)
    const parkingSpaceToUpdate = await em.findOneOrFail(ParkingSpace, { number })
    em.assign(parkingSpaceToUpdate , req.body.sanitizedInput)
    await em.flush()
    res.status(201).json(parkingSpaceToUpdate)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
 try {
   const number = req.params.number
   const parkingSpace = await em.findOneOrFail(ParkingSpace, { number: +number },)
   await em.removeAndFlush(parkingSpace)
   res.status(201).json({ message: 'parkingSpace eliminated' })
 }
 catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeParkingSpaceInput, findAll, findOne, add, update, eliminate }
