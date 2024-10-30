import { Request, Response, NextFunction } from 'express'
import { location } from './location.repository.js'

const locationsRepository = new location()

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
        const locations = await locationsRepository.getAll()

        res.status(200).json(locations)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const location = await locationsRepository.getOne(id)

        res.status(200).json(location)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function add(req: Request, res: Response) {
    try {
        const location = locationsRepository.create(req.body.sanitizedInput)
        res.status(200).json(location)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const updatedLocation = locationsRepository.update(req.body.sanitizedInput, id)
        console.log("Location Updated", updatedLocation)

        res.status(200).json({ message: 'Location updated' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const removedLocation = locationsRepository.remove(id)
        console.log("Removed Location", removedLocation)

        res.status(200).send({ message: 'Location deleted' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


export { sanitizeLocationInput, findAll, findOne, add, update, remove }
