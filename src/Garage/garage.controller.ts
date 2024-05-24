import { Request, Response, NextFunction } from "express";
import { GarageRepository } from "./garage.repository.js"
import { Garage } from "./garage.entity.js";

const repository = new GarageRepository()


function sanitizeUserInput(req: Request, res: Response , next: NextFunction){
  req.body.sanitizedInput = {
    cuit: req.body.cuit,
    name: req.body.name,
    address: req.body.address,
    telephone: req.body.telephone,
    mail: req.body.mail,
    priceHour: req.body.priceHour,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined){ 
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


function findAll(req: Request ,res: Response){
  res.json({ data: repository.findAll() });
}


function findOne(req: Request ,res: Response){
  const id = req.params.id
  const garage = repository.findOne({ id })
  
  if(!garage){
    return res.status(404).send({message: 'Garage not found.'})
  }

  res.json({data: garage})
}


function add(req: Request, res: Response){
  const input = req.body.sanitizedInput

  const garageInput = new Garage(
    input.cuit,
    input.name,
    input.address,
    input.telephone,
    input.mail,
    input.priceHour,
  )

  const garage = repository.add(garageInput)
  return res.status(201).send({message: 'Garage created', data: garage})
}


function update(req: Request ,res: Response){
  req.body.sanitizedInput.id = req.params.id
  const garage = repository.update(req.body.sanitizedInput)

  if(!garage){
    return res.status(404).send({message: "Garage not found"})
  }

  return res.status(200).send({message: 'Garage updated succesfully.', data: garage})
}


function eliminate(req: Request ,res: Response){
  const id = req.params.id
  const garage = repository.delete({id})

  if(!garage) {
    res.status(404).send({message: "Garage not found"})
  } else{
    return res.status(200).send({message: "Garage deleted succesfully"})
  }

}

export { sanitizeUserInput, findAll, findOne, add, update, eliminate}
