import { Request, Response, NextFunction } from "express";
import { Garage } from "./garage.entity.js";
import { orm } from "../shared/db/orm.js";
import bcrypt from "bcrypt"
import { getVehicleBusiness } from "../Vehicle/vehicle.business.js";
import { getAvailablesBusiness, getPriceForReservationBusiness } from "./garage.business.js";
import { getGaragePricingStatus } from "../ReservationType/reservationType.business.js";
import { validationResult } from 'express-validator';
import { handleError } from "../shared/errors/errorHandler.js";

const em = orm.em

function sanitizeGarageInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        cuit: req.body.cuit,
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
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
    catch (error: any) { handleError(error, res) }
}


async function findOne(req: Request, res: Response) {
    try {
        const cuit = Number.parseInt(req.params.cuit)
        const garage = await em.findOneOrFail(Garage, { cuit }, { populate: ['parkingSpaces'] })
        res.status(200).json(garage)
    }
    catch (error: any) { handleError(error, res) }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10)
        const garage = em.create(Garage, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json(garage)
    }
    catch (error: any) { handleError(error, res) }
}


async function update(req: Request, res: Response) {
    try {
        const cuit = Number.parseInt(req.params.cuit)
        const garageToUpdate = await em.findOneOrFail(Garage, { cuit })

        // Hash password if it's being updated
        if (req.body.sanitizedInput.password) {
            req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10)
        }

        em.assign(garageToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json(garageToUpdate)
    }
    catch (error: any) { handleError(error, res) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit
        const garage = await em.findOneOrFail(Garage, { cuit: +cuit },)
        await em.removeAndFlush(garage)
        res.status(200).json({ message: 'Garage eliminated' })
    }
    catch (error: any) { handleError(error, res) }
}

async function getAvailables(req: Request, res: Response) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkin = new Date(`${req.query.check_in_at}`)
        const checkout = new Date(`${req.query.check_out_at}`)
        const licensePlate = `${req.query.license_plate}`

        const vehicle = await getVehicleBusiness(licensePlate)

        if (vehicle == null) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const garagesAvailables = await getAvailablesBusiness(checkin, checkout, vehicle?.type.id!);
        
        // Filtrar solo garages con precios completos
        const garagesConPreciosCompletos = await Promise.all(
            garagesAvailables.map(async (garage) => {
                const status = await getGaragePricingStatus(garage.cuit);
                return status.completo ? garage : null;
            })
        );
        
        const garagesFiltrados = garagesConPreciosCompletos.filter((g): g is Garage => g !== null);

        // Calcular precio para cada garage
        const garagesConPrecio = await Promise.all(
            garagesFiltrados.map(async (garage) => {
                const precioEstimado = await getPriceForReservationBusiness(checkin, checkout, garage.cuit);
                return {
                    cuit: garage.cuit,
                    name: garage.name,
                    address: garage.address,
                    email: garage.email,
                    phoneNumber: garage.phoneNumber,
                    location: garage.location,
                    precioEstimado: precioEstimado
                };
            })
        );
        res.status(200).json(garagesConPrecio);
    } catch (error: any) { handleError(error, res) }
}


export { sanitizeGarageInput, findAll, findOne, add, update, eliminate, getAvailables }


