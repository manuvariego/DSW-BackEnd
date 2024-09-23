import { Request, Response, NextFunction } from "express";
import { typeVehicle } from "./vehicleType.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

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
        const typeVehicles = await em.find(typeVehicle, {}, { populate: ['vehicles'] })

        res.status(200).json(typeVehicles)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const typevehicle = await em.findOneOrFail(typeVehicle, { id }, { populate: ['vehicles'] })

        res.status(200).json(typevehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        const typevehicle = em.create(typeVehicle, req.body.sanitizedInput)
        await em.flush()

        res.status(200).json(typevehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const typeVehicleToUpdate = await em.findOneOrFail(typeVehicle, { id })
        em.assign(typeVehicleToUpdate, req.body.sanitizedInput)
        await em.flush()

        res.status(200).json(typeVehicleToUpdate)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const typevehicle = await em.findOneOrFail(typeVehicle, { id })
        await em.removeAndFlush(typevehicle)

        res.status(200).json({ message: 'typeVehicle eliminated' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizetypeVehicleInput, findAll, findOne, add, update, eliminate }

