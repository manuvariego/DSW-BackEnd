import { Request, Response, NextFunction } from 'express'
import { locationRepository } from './location.repository.js'

const LocationsRepository = new locationRepository()

function sanitizeLocationInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        name: req.body.name,
        province: req.body.province,
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
        const locations = await LocationsRepository.getAll()

        res.status(200).json(locations)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = await LocationsRepository.getOne(id)

        res.status(200).json(location)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function add(req: Request, res: Response) {
    try {
        const location = LocationsRepository.create(req.body.sanitizedInput)
        res.status(200).json(location)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const updatedLocation = LocationsRepository.update(req.body.sanitizedInput, id)
        console.log("Location Updated", updatedLocation)

        res.status(200).json({ message: 'Location updated' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const removedLocation = LocationsRepository.remove(id)
        console.log("Removed Location", removedLocation)

        res.status(200).send({ message: 'Location deleted' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


export { sanitizeLocationInput, findAll, findOne, add, update, remove }
