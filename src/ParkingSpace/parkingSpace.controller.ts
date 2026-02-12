import { Request, Response, NextFunction } from "express";
import { ParkingSpace } from "./parkingSpace.entity.js";
import { orm } from "../shared/db/orm.js";
import { handleError } from "../shared/errors/errorHandler.js";


const em = orm.em

function sanitizeParkingSpaceInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    number: req.body.number,
    garage: req.body.garage,
    TypeVehicle: req.body.TypeVehicle
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
    const parkingSpaces = await em.find(ParkingSpace, {}, { populate: ['TypeVehicle'] })
    res.status(200).json(parkingSpaces)
  }
  catch (error: any) { handleError(error, res)}
}

async function findAllofAGarage(req: Request, res: Response) {
    try {
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const parkingSpaces = await em.find(ParkingSpace, { garage: {cuit: cuitGarage} }, { populate: ['TypeVehicle'] })
        res.status(200).json(parkingSpaces)
    }
    catch (error: any) { handleError(error, res) }
}

async function findOne(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.number)
    const cuitGarage = Number.parseInt(req.params.cuitGarage)
    const parkingSpace = await em.findOneOrFail(ParkingSpace, { number, garage: { cuit: cuitGarage } }, { populate: ['TypeVehicle'] })
    res.status(200).json(parkingSpace)
  }
  catch (error: any) { handleError(error, res) }
}


async function add(req: Request, res: Response) {
  try {
    const parkingSpace = em.create(ParkingSpace, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json(parkingSpace)
  }
  catch (error: any) { handleError(error, res) }
}


async function update(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.number)
    const cuitGarage = Number.parseInt(req.params.cuitGarage)
    const parkingSpaceToUpdate = await em.findOneOrFail(ParkingSpace, { number, garage: { cuit: cuitGarage } })
    em.assign(parkingSpaceToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json(parkingSpaceToUpdate)
  }
  catch (error: any) { handleError(error, res) }
}


async function eliminate(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.number)
    const cuitGarage = Number.parseInt(req.params.cuitGarage)
    const parkingSpace = await em.findOneOrFail(ParkingSpace, { number: +number, garage: { cuit: cuitGarage } },)
    await em.removeAndFlush(parkingSpace)
    res.status(200).json({ message: 'ParkingSpace deleted successfully' })
  }
  catch (error: any) { handleError(error, res) }

}

export { sanitizeParkingSpaceInput, findAll, findOne, add, update, eliminate, findAllofAGarage }
