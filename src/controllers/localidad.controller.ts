import { Request, Response, NextFunction } from 'express'
import { Localidad } from '../entities/localidad.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

//function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
//  req.body.sanitizedInput = {
//    nombre: req.body.nombre,
//    provincia: req.body.provincia,
//
//  }
//
//  Object.keys(req.body.sanitizedInput).forEach((key) => {
//    if (req.body.sanitizedInput[key] === undefined) {
//      delete req.body.sanitizedInput[key]
//    }
//  })
//  next()
//}

async function findAll(req: Request, res: Response) {
  try {
    const localidades = await em.find(Localidad, {})
    res.status(200).json({ message: 'found all localidades', data: localidades })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const localidad = await em.findOneOrFail(Localidad, { id })
    res.status(200).json({ message: 'found localidad', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const localidad = em.create(Localidad, req.body)
    await em.flush()
    res.status(201).json({ message: 'localidad created', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const localidad = em.getReference(Localidad, id)
    em.assign(localidad, req.body)
    await em.flush()
    res.status(200).json({ message: 'localidad updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const localidad = em.getReference(Localidad, id)
    await em.removeAndFlush(localidad)
    res.status(200).send({ message: 'localidad deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export { findAll, findOne, add, update, remove }