import { Request, Response, NextFunction } from "express";
import { typevehicleRepository } from "./vehicleType.repository.js"

const TypeVehicleRepository = new typevehicleRepository()

function sanitizetypeVehicleInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        name: req.body.name,
        vehicles: req.body.vehicles
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
        const typevehicles = await TypeVehicleRepository.getAll()

        res.status(200).json(typevehicles)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const typevehicle = await TypeVehicleRepository.getOne(id)

        res.status(200).json(typevehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        const typevehicle = await TypeVehicleRepository.create(req.body.sanitizedInput)

        res.status(200).json(typevehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const updatedTypeVehicle = await TypeVehicleRepository.update(req.body.sanitizedInput, id)

        res.status(200).json(updatedTypeVehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const typevehicle = await TypeVehicleRepository.remove(id)
        console.log("Removed Type Vehicle", typevehicle)

        res.status(200).json({ message: 'typeVehicle eliminated' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizetypeVehicleInput, findAll, findOne, add, update, eliminate }

