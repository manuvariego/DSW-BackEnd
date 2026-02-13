import { Request, Response, NextFunction } from "express";
import { Vehicle } from "./vehicle.entity.js";
import { orm } from "../shared/db/orm.js";
import { getVehicleBusiness } from "./vehicle.business.js";
import { User } from "../User/user.entity.js";
import { typeVehicle } from "../VehicleType/vehicleType.entity.js";
import { handleError } from "../shared/errors/errorHandler.js";

const em = orm.em

function sanitizeVehicleInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        license_plate: req.body.license_plate,
        type: req.body.type,
        reservation: req.body.reservation
        // owner is taken from authenticated token, not request body
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
        const vehicles = await em.find(Vehicle, {},)

        res.status(200).json(vehicles)

    } catch (error: any) { handleError(error, res) }
}


async function findOne(req: Request, res: Response) {
    try {
        const license_plate = req.params.license_plate;
        
        const vehicle = await getVehicleBusiness(license_plate);

        if (vehicle == null) {
            res.status(404).json({})    
        } else {
            res.status(200).json(vehicle)
        }

    } catch (error: any) { handleError(error, res) }
}


async function findByOwner(req: Request, res: Response) {
    try {
        const ownerId = Number(req.params.ownerId);
        const vehicles = await em.find(Vehicle, { owner: { id: ownerId } }, { populate: ['type'] });
        res.status(200).json(vehicles);
    } catch (error: any) { handleError(error, res) }
}


async function add(req: Request, res: Response) {
    try {
        // Use authenticated user's ID from token
        req.body.sanitizedInput.owner = req.user?.id;

        const vehicle = em.create(Vehicle, req.body.sanitizedInput)
        await em.flush()

        res.status(201).json(vehicle)

    } catch (error: any) { handleError(error, res) }
}


async function update(req: Request, res: Response) {
    try {
        const license_plate = req.params.license_plate;
        const vehicleToUpdate = await em.findOneOrFail(Vehicle, { license_plate })
        em.assign(vehicleToUpdate, req.body.sanitizedInput)
        await em.flush()

        res.status(200).json(vehicleToUpdate)

    } catch (error: any) { handleError(error, res) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const license_plate = req.params.license_plate;
        const vehicleToRemove = await em.findOneOrFail(Vehicle, { license_plate })
        await em.removeAndFlush(vehicleToRemove)

        res.status(200).json({ message: 'Vehicle eliminated' })

    } catch (error: any) { handleError(error, res) }

}

export { sanitizeVehicleInput, findAll, findOne, findByOwner, add, update, eliminate }

