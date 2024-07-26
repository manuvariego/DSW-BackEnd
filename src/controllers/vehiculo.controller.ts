import { Request, Response, NextFunction } from "express";
import { Vehiculo } from "../entities/vehiculo.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    patente: req.body.patente,
    tipo: req.body.tipo,
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
    const vehiculos = await em.find(Vehiculo, {},)
    res.status(201).json({ message: 'Vehiculo Encontrado', data: vehiculos })
  } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
  try {
    const patente = req.params.patente
    const vehiculo = await em.findOneOrFail(Vehiculo, { patente },)
    res.status(201).json({ message: 'Vehiculo Encontrado', data: vehiculo })
  } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
  try {
    const vehiculo = em.create(Vehiculo, req.body.sanitizedInput)
    console.log(vehiculo)
    await em.persistAndFlush(vehiculo)
    res.status(201).json({ Message: 'Vehiculo Creado / dado de alta', data: vehiculo })
  } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
  try {
    const patente = req.params.vehiculo;

    const vehiculoToUpdate = await em.findOneOrFail(Vehiculo, { patente })
    em.assign(vehiculoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Vehiculo actualizado / modificado', data: vehiculoToUpdate })
  } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
  try {
    const patente = req.params.vehiculo;

    const vehiculo = await em.findOneOrFail(Vehiculo, { patente })

    await em.removeAndFlush(vehiculo)

    res.status(201).json({ message: 'Vehiculo eliminado / dado de baja' })
  } catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeUserInput, findAll, findOne, add, update, eliminate }

