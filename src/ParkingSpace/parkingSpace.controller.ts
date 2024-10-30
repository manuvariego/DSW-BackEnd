import { Request, Response, NextFunction } from "express";
import { parkingspace } from "./parkingSpace.repository.js"


const parkingSpaceRepository = new parkingspace()

function sanitizeParkingSpaceInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        number: req.body.number,
        garage: req.body.garage,
        reservation: req.body.reservation,
        TypeVehicle: req.body.TypeVehicle
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
        const parkingSpaces = await parkingSpaceRepository.getAll()
        res.status(201).json(parkingSpaces)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}



async function findOne(req: Request, res: Response) {
    try {

        const number = Number.parseInt(req.params.number)
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const parkingSpace = await parkingSpaceRepository.getOne(number, cuitGarage)

        res.status(201).json(parkingSpace)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        const parkingSpace = parkingSpaceRepository.create(req.body.sanitizedInput)
        res.status(201).json(parkingSpace)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const number = Number.parseInt(req.params.number)
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const parkingSpaceToUpdate = await parkingSpaceRepository.update(req.body.sanitizedInput, number, cuitGarage)
        console.log("Updated Parking Space", parkingSpaceToUpdate)
        res.status(201).json(parkingSpaceToUpdate)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const number = Number.parseInt(req.params.number)
        const cuitGarage = Number.parseInt(req.params.cuitGarage)
        const removedParkingSpace = await parkingSpaceRepository.remove(number, cuitGarage)
        console.log("Removed parking space", removedParkingSpace)
        res.status(201).json({ message: 'parkingSpace eliminated' })
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeParkingSpaceInput, findAll, findOne, add, update, eliminate }
