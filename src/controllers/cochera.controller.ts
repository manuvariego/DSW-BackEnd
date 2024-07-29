import { Request, Response, NextFunction } from "express";
import { Cochera } from "../entities/cochera.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeCocheraInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cuit: req.body.cuit,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    correo: req.body.correo,
    precioHora: req.body.precioHora,
    localidad: req.body.localidad
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
    const cocheras = await em.find(Cochera, {},)
    res.status(201).json({ message: 'Cocheras encontradas', data:cocheras })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
  try {
    const cuit = Number.parseInt(req.params.cuit)
    const cochera = await em.findOneOrFail(Cochera, { cuit })
    res.status(201).json({ message: 'Cochera encontrada', data: cochera })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
  try {
    const cochera = em.create(Cochera, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ Message: 'Cochera created', data:cochera })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
  try {
    const cuit = Number.parseInt(req.params.cuit)
    const cocheraToUpdate = await em.findOneOrFail(Cochera, { cuit })
    em.assign(cocheraToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Cochera actualizada', data: cocheraToUpdate })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
 try {
   const cuit = req.params.cuit
   const cochera = await em.findOneOrFail(Cochera, { cuit: +cuit },)
   await em.removeAndFlush(cochera)
   res.status(201).json({ message: 'Cochera eliminada' })
 }
 catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeCocheraInput, findAll, findOne, add, update, eliminate }
