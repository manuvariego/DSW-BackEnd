import { Request, Response, NextFunction } from "express";
import { Cochera } from "./cochera.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cuit: req.body.cuit,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    correo: req.body.correo,
    precioHora: req.body.precioHora,
    //class: req.body.class,
    //items: req.body.items
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
    res.status(201).json({ message: 'Cocheras encontradas', data: cocheras })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
  try {
    const cuit = Number.parseInt(req.params.cuit)
    const cocheras = await em.findOneOrFail(Cochera, { cuit }, { populate: ['localidad'] })
    res.status(201).json({ message: 'Cochera encontrada', data: cocheras })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
  try {
    const user = em.create(User, req.body.sanitizedInput)
    await em.persistAndFlush(user)
    res.status(201).json({ Message: 'User created', data: user })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const userToUpdate = await em.findOneOrFail(User, { id })
    em.assign(userToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'User updated', data: userToUpdate })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    await em.removeAndFlush(user)
    res.status(201).json({ message: 'Character eliminated' })
  }
  catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeUserInput, add, update, eliminate }
