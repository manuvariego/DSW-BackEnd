import { Request, Response, NextFunction } from "express";
import { ReservationType, typeCode } from "./reservationType.entity.js";
import { orm } from "../shared/db/orm.js";
//import { Garage } from "../entities/garage.entity.js";

const em = orm.em

function sanitizeReservationTypeInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        description: req.body.description,
        price: req.body.price,
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
        const reservationTypes = await em.find(ReservationType, {},)

        res.status(200).json(reservationTypes)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const description: typeCode = req.params.description as typeCode
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const reservationType = await em.findOneOrFail(ReservationType, {description, garage: {cuit: cuitGarage}})

        res.status(200).json(reservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        const reservationType = em.create(ReservationType, req.body.sanitizedInput)
        await em.flush()

        res.status(200).json(ReservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const description: typeCode = req.params.description as typeCode
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const reservationTypeToUpdate = await em.findOneOrFail(ReservationType, {description, garage: {cuit: cuitGarage}})
        em.assign(reservationTypeToUpdate, req.body.sanitizedInput)
        await em.flush()

        res.status(200).json(ReservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const description: typeCode = req.params.description as typeCode
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const reservationType = await em.findOneOrFail(ReservationType, {description, garage: {cuit: cuitGarage}})
        await em.removeAndFlush(reservationType)

        res.status(200).json(ReservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeReservationTypeInput, findAll, findOne, add, update, eliminate }
