import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "./user.entity.js";
import { Vehicle } from "../Vehicle/vehicle.entity.js";
import { orm } from "../shared/db/orm.js";
import { Reservation } from "../Reservation/reservation.entity.js";
import { getActiveReservationsByUserBusiness } from "../Reservation/reservation.business.js";
import { handleError } from "../shared/errors/errorHandler.js";


const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        dni: req.body.dni,
        name: req.body.name,
        lastname: req.body.lastname,
        password: req.body.password,
        address: req.body.address,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        vehicle: req.body.vehicle,
        role: req.body.role
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
        const users = await em.find(User, {}, { populate: ['vehicles'] })
        res.status(200).json(users)
    } catch (error: any) { handleError(error, res) }
}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = await em.findOneOrFail(User, { id }, { populate: ['vehicles'] })
        res.status(200).json(user)
    } catch (error: any) { handleError(error, res) }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10)
        const user = em.create(User, req.body.sanitizedInput)
        await em.persistAndFlush(user)
        res.status(201).json(user)
    } catch (error: any) { handleError(error, res) }
}


async function getActiveReservations(req: Request, res: Response) {
    try {
        const userId = Number.parseInt(req.params.id)
        const activeReservations = await getActiveReservationsByUserBusiness(userId)
        res.status(200).json(activeReservations)
    } catch (error: any) { handleError(error, res) }
}


async function getVehicles(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const vehicles = await em.find(Vehicle, { owner: id })
        res.status(200).json(vehicles)
    } catch (error: any) { handleError(error, res) }
}


async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const userToUpdate = await em.findOneOrFail(User, { id })

        // Hash password if it's being updated
        if (req.body.sanitizedInput.password) {
            req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10)
        }

        em.assign(userToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json(userToUpdate)
    } catch (error: any) { handleError(error, res) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = em.getReference(User, id)
        await em.removeAndFlush(user)
        res.status(200).json({ message: 'User eliminated' })
    } catch (error: any) { handleError(error, res) }
}


export { getVehicles, sanitizeUserInput, findAll, findOne, add, update, eliminate, getActiveReservations }
