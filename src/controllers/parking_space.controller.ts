import { Request, Response, NextFunction } from "express";
import { Parking_space } from "../entities/parking_space.entity.js";
import { orm } from "../shared/db/orm.js";


const em = orm.em

function sanitizeParking_spaceInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    number: req.body.number,
    garage: req.body.garage
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
    const parking_spaces = await em.find(Parking_space, {},)
    res.status(201).json({ message: 'Parking_space found', data:parking_spaces })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}



async function findOne(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.number)
    const parking_space = await em.findOneOrFail(Parking_space, { number })
    res.status(201).json({ message: 'parking_space found', data: parking_space })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
  try {
    const parking_space = em.create(Parking_space, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ Message: 'parking_space created', data:parking_space })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
  try {
    const number = Number.parseInt(req.params.cuit)
    const parking_spaceToUpdate = await em.findOneOrFail(Parking_space, { number })
    em.assign(parking_spaceToUpdate , req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'parking_space updated', data: parking_spaceToUpdate })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
 try {
   const number = req.params.number
   const parking_space = await em.findOneOrFail(Parking_space, { number: +number },)
   await em.removeAndFlush(parking_space)
   res.status(201).json({ message: 'parking_space eliminated' })
 }
 catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeParking_spaceInput, findAll, findOne, add, update, eliminate }
