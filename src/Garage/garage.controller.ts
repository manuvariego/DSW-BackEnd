import { Request, Response, NextFunction } from "express";
import { Garage } from "./garage.entity.js";
import { orm } from "../shared/db/orm.js";
import bcrypt from "bcrypt"
import { getVehicleBusiness } from "../Vehicle/vehicle.business.js";
import { getAvailablesBusiness } from "./garage.business.js";
import { validationResult } from 'express-validator';

const em = orm.em

function sanitizeGarageInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        cuit: req.body.cuit,
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
        phone_number: req.body.phone_number,
        email: req.body.email,
        priceHour: req.body.priceHour,
        location: req.body.location,
        parking_space: req.body.parking_space
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
        const garages = await em.find(Garage, {}, { populate: ['parkingSpaces'] })
        res.status(200).json(garages)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const cuit = Number.parseInt(req.params.cuit)
        const garage = await em.findOneOrFail(Garage, { cuit }, { populate: ['parkingSpaces'] })
        res.status(200).json(garage)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10)
        const garage = em.create(Garage, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json(garage)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function update(req: Request, res: Response) {
    try {
        const cuit = Number.parseInt(req.params.cuit)
        const garageToUpdate = await em.findOneOrFail(Garage, { cuit })
        em.assign(garageToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json(garageToUpdate)
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit
        const garage = await em.findOneOrFail(Garage, { cuit: +cuit },)
        await em.removeAndFlush(garage)
        res.status(200).json({ message: 'Garage eliminated' })
    }
    catch (error: any) { res.status(500).json({ message: error.message }) }

}

async function getAvailables(req: Request, res: Response) {
    try {
        //validar las fechas ingresadas.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, devolver un error 400 con los detalles. 
            return res.status(400).json({ errors: errors.array() });
        }
        
        //se supone que las fechas a continuacion son validas
        const checkin = new Date(`${req.query.check_in_at}`)
        const checkout = new Date(`${req.query.check_out_at}`)
        const licensePlate = `${req.query.license_plate}`

        const vehicle = await getVehicleBusiness(licensePlate)

        if (vehicle == null) {
            console.log('No se encontro el vehiculo');
            res.status(404).json();
            return;
        }

        const garagesAvailables = await getAvailablesBusiness(checkin, checkout, vehicle?.type.id!);

        res.status(200).json(garagesAvailables);

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


export { sanitizeGarageInput, findAll, findOne, add, update, eliminate, getAvailables }


