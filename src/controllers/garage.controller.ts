import { Request, Response, NextFunction } from "express";
import { Garage } from "../entities/garage.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeGarageInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cuit: req.body.cuit,
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
    email: req.body.email,
    priceHour: req.body.priceHour,
    location: req.body.location
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
    const garages = await em.find(Garage, {},)
    res.status(200).json(garages)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
  try {
    const cuit = Number.parseInt(req.params.cuit)
    const garage = await em.findOneOrFail(Garage, { cuit })
    res.status(200).json(garage)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
  try {
    const garage = em.create(Garage, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json(garage)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
  try {
    const cuit = Number.parseInt(req.params.cuit)
    const garageToUpdate = await em.findOneOrFail(Garage, { cuit })
    em.assign(garageToUpdate , req.body.sanitizedInput)
    await em.flush()
    res.status(200).json(garageToUpdate)
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
 try {
   const cuit = req.params.cuit
   const garage = await em.findOneOrFail(Garage, { cuit: +cuit },)
   await em.removeAndFlush(garage)
   res.status(200).json({ message: 'Garage eliminated' })
 }
 catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeGarageInput, findAll, findOne, add, update, eliminate }
