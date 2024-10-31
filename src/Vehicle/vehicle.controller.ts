import { Request, Response, NextFunction } from "express";
import { Vehicle } from "./vehicle.entity.js";
import { orm } from "../shared/db/orm.js";
//import { getVehicleBusiness } from "./vehicle.business.js";
//import { Reservation } from "../Reservation/reservation.entity.js";
import { vehicle } from "./vehicle.repository.js"

const em = orm.em
const vehicleRepository = new vehicle()

function sanitizeVehicleInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        license_plate: req.body.license_plate,
        owner: req.body.owner,
        type: req.body.type,
        reservation: req.body.reservation
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
        const vehicles = await vehicleRepository.getAll()

        res.status(200).json(vehicles)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const license_plate = req.params.license_plate;

        const vehicle = await vehicleRepository.getOne(license_plate)

        if (vehicle == null) {
            res.status(404).json({})
        } else {
            res.status(200).json(vehicle)
        }

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        const vehicle = vehicleRepository.create(req.body.sanitizedInput)
        res.status(200).json(vehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const license_plate = req.params.license_plate;
        const updatedVehicle = await vehicleRepository.update(req.body.sanitizedInput, license_plate)

        res.status(200).json(updatedVehicle)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const license_plate = req.params.license_plate;
        const removedVehicle = await vehicleRepository.remove(license_plate)
        console.log("Removed Vehicle", removedVehicle)

        res.status(200).json({ message: 'Vehicle eliminated' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }

}

export { sanitizeVehicleInput, findAll, findOne, add, update, eliminate }

