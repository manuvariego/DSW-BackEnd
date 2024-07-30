import { Request, Response, NextFunction } from "express";
import { Vehicle } from "../entities/vehicle.entity.js";
import { orm } from "../shared/db/orm.js";

const em= orm.em

function sanitizeVehicleInput(req: Request, res: Response , next: NextFunction){
  req.body.sanitizedInput = {
    license_plate: req.body.license_plate,
    owner: req.body.owner
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined){ 
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request ,res: Response){
  try {  
    const vehicles = await em.find(Vehicle, {},) 

    res.status(201).json({message: 'Vehicles found', data:vehicles})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function findOne(req: Request ,res: Response){
  try {  
    const license_plate = req.params.license_plate;
    const vehicle = await em.findOneOrFail(Vehicle, {license_plate},) 

    res.status(201).json({message: 'Vehicle found', data:vehicle})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function add(req: Request, res: Response){
  try {
    const vehicle = em.create(Vehicle, req.body.sanitizedInput)
    await em.flush()

    res.status(201).json({Message: 'Vehicle created ', data:vehicle})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function update(req: Request ,res: Response){
  try {  
    const license_plate = req.params.license_plate;
    const vehicleToUpdate = await em.findOneOrFail(Vehicle, {license_plate})
    em.assign(vehicleToUpdate, req.body.sanitizedInput)
    await em.flush()

    res.status(201).json({message: 'Vehicle updated' , data:vehicleToUpdate})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function eliminate(req: Request ,res: Response){
  try{
    const license_plate = req.params.license_plate;
    const vehiculo = await em.findOneOrFail(Vehicle, { license_plate })
    await em.removeAndFlush(vehiculo)

    res.status(201).json({message: 'Vehicle eliminated'})

  } catch (error:any){res.status(500).json({message: error.message})}

}

export { sanitizeVehicleInput, findAll, findOne, add, update ,eliminate}

