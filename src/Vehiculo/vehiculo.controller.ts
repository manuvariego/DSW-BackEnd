import { Request, Response, NextFunction } from "express";
import { Vehiculo } from "./vehiculo.entity.js";
import { orm } from "../shared/db/orm.js";

const em= orm.em

function sanitizeVehiculoInput(req: Request, res: Response , next: NextFunction){
  req.body.sanitizedInput = {
    patente: req.body.patente,
    owner: req.body.owner,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined){ 
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request ,res: Response){
try{  const vehiculos = await em.find(Vehiculo, {},) 
  res.status(201).json({message: 'Vehiculos Encontrados', data:vehiculos})
} catch (error:any){res.status(500).json({message: error.message})}
}


async function findOne(req: Request ,res: Response){
try{  const patente = req.params.patente;
  const vehiculo = await em.findOneOrFail(Vehiculo, {patente},) 

  res.status(201).json({message: 'Vehiculo Encontrado', data:vehiculo})
}catch (error:any){res.status(500).json({message: error.message})}
}


async function add(req: Request, res: Response){
try{
  console.log(`add ${JSON.stringify(req.body.sanitizedInput)}`)
  const vehiculo = em.create(Vehiculo, req.body.sanitizedInput)
  await em.flush()
  res.status(201).json({Message: 'Vehiculo Creado / dado de alta', data:vehiculo})
} catch (error:any){res.status(500).json({message: error.message})}
}


async function update(req: Request ,res: Response){
try{  const patente = req.params.patente;
console.log(patente)
  const vehiculoToUpdate = await em.findOneOrFail(Vehiculo, {patente})
  em.assign(vehiculoToUpdate, req.body.sanitizedInput)
  await em.flush()
  res.status(201).json({message: 'Vehiculo actualizado / modificado', data:vehiculoToUpdate})
} catch (error:any){res.status(500).json({message: error.message})}
}


async function eliminate(req: Request ,res: Response){
  try{
    const patente = req.params.patente;

    const vehiculo = await em.findOneOrFail(Vehiculo, { patente })
  
  await em.removeAndFlush(vehiculo)

  res.status(201).json({message: 'Vehiculo eliminado / dado de baja'})
} catch (error:any)
{res.status(500).json({message: error.message})}

}

export { sanitizeVehiculoInput, findAll, findOne, add, update ,eliminate}

