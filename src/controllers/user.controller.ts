import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user.entity.js";
import { Vehicle } from "../entities/vehicle.entity.js";
import { orm } from "../shared/db/orm.js";


const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    lastname: req.body.lastname,
    dni: req.body.dni,
    address: req.body.address,
    email: req.body.email,
    phone_number: req.body.phone_number,
    vehicle: req.body.vehicle
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request ,res: Response){
  try { 
    const users = await em.find(User, {}, {populate: ['vehicles']})

    res.status(201).json({message: 'Users found', data:users})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function findOne(req: Request ,res: Response){
  try {  
    const id = Number.parseInt(req.params.id)
    const user = await em.findOneOrFail(User, {id}, {populate: ['vehicles']})

    res.status(201).json({message: 'User found', data:user})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function add(req: Request, res: Response) {
  try {
    const user = em.create(User, req.body.sanitizedInput)
    await em.persistAndFlush(user)

    res.status(201).json({ Message: 'User created', data: user })

  } catch (error: any) { res.status(500).json({ message: error.message }) }
}

async function get_vehicles(req: Request ,res: Response){
  try {  
    const id = Number.parseInt(req.params.id)
    const vehicles = await em.find(Vehicle, {owner:  id})
    console.log(vehicles)

    res.status(201).json({message: 'Vehicles found for this user', data:vehicles})

  } catch (error:any){res.status(500).json({message: error.message})}
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const userToUpdate = await em.findOneOrFail(User, { id })
    em.assign(userToUpdate, req.body.sanitizedInput)
    await em.flush()

    res.status(201).json({ message: 'User updated', data: userToUpdate })

  } catch (error: any) { res.status(500).json({ message: error.message }) }
}


async function eliminate(req: Request ,res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    await em.removeAndFlush(user)

    res.status(201).json({message: 'User eliminated'})

  } catch (error:any){res.status(500).json({message: error.message})}
}

export {get_vehicles, sanitizeUserInput, findAll, findOne, add, update, eliminate }
