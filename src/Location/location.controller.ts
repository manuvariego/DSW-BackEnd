import { Request, Response, NextFunction } from 'express'
import { Location } from './location.entity.js'
import { orm } from '../shared/db/orm.js'
import { handleError } from "../shared/errors/errorHandler.js";

const em = orm.em

function sanitizeLocationInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        name: req.body.name,
        province: req.body.province
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
        const locations = await em.find(Location, {}, { populate: ['garages'] })
        res.status(200).json(locations)

    } catch (error: any) { handleError(error, res) }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = await em.findOneOrFail(Location, { id }, { populate: ['garages'] })
        res.status(200).json(location)

    } catch (error: any) { handleError(error, res) }
}

async function add(req: Request, res: Response) {
    try {
        const location = em.create(Location, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json(location)

    } catch (error: any) { handleError(error, res) }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = em.getReference(Location, id)
        em.assign(location, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Location updated' })  

    } catch (error: any) { handleError(error, res) }
}


async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = em.getReference(Location, id)
        await em.removeAndFlush(location)

        res.status(200).send({ message: 'Location deleted' })

    } catch (error: any) { handleError(error, res) }
}


export { sanitizeLocationInput, findAll, findOne, add, update, remove }
