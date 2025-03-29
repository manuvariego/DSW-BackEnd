import { Request, Response, NextFunction } from "express";
import { ReservationType, typeCode } from "./reservationType.entity.js";
import { reservationTypeRepository } from "./reservationType.repository.js";

const ReservationTypeRepository = new reservationTypeRepository()

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
        const reservationTypes = await ReservationTypeRepository.getAll()

        res.status(200).json(reservationTypes)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const description: typeCode = req.params.description as typeCode
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const reservationType = await ReservationTypeRepository.getOne(cuitGarage, description)

        res.status(200).json(reservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        const reservationType = await ReservationTypeRepository.create(req.body.sanitizedInput)

        res.status(200).json(reservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const description: typeCode = req.params.description as typeCode
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const reservationTypeToUpdate = await ReservationTypeRepository.update(req.body.sanitizedInput, cuitGarage, description)

        res.status(200).json(reservationTypeToUpdate)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const description: typeCode = req.params.description as typeCode
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const reservationType = await ReservationTypeRepository.remove(description, cuitGarage)

        res.status(200).json(reservationType)

    } catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeReservationTypeInput, findAll, findOne, add, update, eliminate }
