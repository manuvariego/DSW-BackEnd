import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { getActiveReservationsByUserBusiness } from "../Reservation/reservation.service.js";
import { userRepository } from "./user.repository.js"
import { AuthRequest } from "../middlewares/auth.js"


const UserRepository = new userRepository()

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        dni: req.body.dni,
        name: req.body.name,
        lastname: req.body.lastname,
        password: req.body.password,
        address: req.body.address,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        vehicle: req.body.vehicle
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
        const users = await UserRepository.getAll()
        res.status(200).json(users)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const user = await UserRepository.getOne(id)

        res.status(200).json(user)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function add(req: Request, res: Response) {
    try {
        req.body.sanitizedInput.password = await bcrypt.hash(req.body.sanitizedInput.password, 10)
        const user = await UserRepository.create(req.body.sanitizedInput)

        res.status(200).json(user)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function login(req: Request, res: Response) {
    try {
        //Cambiar esto los busca por id no por DNI
        const userId = Number.parseInt(req.body.id)
        const user = await UserRepository.getOne(userId)
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const token = jwt.sign({
            userId: user.id,
            name: user.name,
            type: "user",
        }, process.env.JWT_SECRET as Secret, { expiresIn: '1h' })

        return res.status(200).json({
            message: "Login successful",
            token: token
        })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function getActiveReservations(req: Request, res: Response) {
    try {
        const userId = Number.parseInt(req.params.id)
        const activeReservations = await getActiveReservationsByUserBusiness(userId)
        res.status(200).json(activeReservations)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function getVehicles(req: AuthRequest, res: Response) {
    try {
        const userIdToken = Number.parseInt(req.user?.userId)
        console.log(userIdToken)
        const userIdParams = Number.parseInt(req.params.id)
        console.log(userIdParams)
        if (userIdToken != userIdParams) {
            return res.status(403).json({
                message: "Forbidden. You can only access your own vehicles"
            })
        }

        const userVehicles = await UserRepository.vehicles(userIdParams)
        console.log(userVehicles)

        res.status(200).json(userVehicles)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const updatedUser = await UserRepository.update(req.body.sanitizedInput, id)

        res.status(200).json(updatedUser)

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const removedUser = UserRepository.remove(id)
        console.log("Removed User", removedUser)

        res.status(200).json({ message: 'User eliminated' })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

export { login, getVehicles, sanitizeUserInput, findAll, findOne, add, update, eliminate, getActiveReservations }
