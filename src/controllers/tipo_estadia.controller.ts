import { Request, Response, NextFunction } from "express";
import { TipoEstadia } from "../entities/tipo_estadia.entity.js";
import { orm } from "../shared/db/orm.js";

const em= orm.em

function sanitizeTipoEstadiaInput(req: Request, res: Response , next: NextFunction){
  req.body.sanitizedInput = {
    tipoE: req.body.tipoE
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
    const tiposE = await em.find(TipoEstadia, {},) 

    res.status(201).json({message: 'Tipos de estadía found', data:tiposE})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function findOne(req: Request ,res: Response){
  try {  
    const tipoE = req.params.tipoE;
    const tipoEstadia = await em.findOneOrFail(TipoEstadia, {tipoE},) 

    res.status(201).json({message: 'Tipo de estadía found', data:tipoEstadia})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function add(req: Request, res: Response){
  try {
    const tipoEstadia = em.create(TipoEstadia, req.body.sanitizedInput)
    await em.flush()

    res.status(201).json({Message: 'Tipo de estadía created ', data:tipoEstadia})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function update(req: Request ,res: Response){
  try {  
    const tipoE = req.params.tipoE;
    const tipoEstadiaToUpdate = await em.findOneOrFail(TipoEstadia, {tipoE})
    em.assign(tipoEstadiaToUpdate, req.body.sanitizedInput)
    await em.flush()

    res.status(201).json({message: 'Tipo de estadía updated' , data:tipoEstadiaToUpdate})

  } catch (error:any){res.status(500).json({message: error.message})}
}


async function eliminate(req: Request ,res: Response){
  try{
    const tipoE = req.params.tipoE;
    const tipoEstadia = await em.findOneOrFail(TipoEstadia, { tipoE })
    await em.removeAndFlush(tipoEstadia)

    res.status(201).json({message: 'Tipo de estadía eliminated'})

  } catch (error:any){res.status(500).json({message: error.message})}

}

export { sanitizeTipoEstadiaInput, findAll, findOne, add, update ,eliminate}