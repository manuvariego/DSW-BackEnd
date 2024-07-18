import { Request, Response, NextFunction } from "express";
import { createUser } from "./usuario.repository.js";
import { User } from "./usuario.entity.js";


export function sanitizeUserInput(req: Request, res: Response , next: NextFunction){
  req.body.sanitizedInput = {
    name: req.body.name,
    lastname: req.body.lastname,
    dni: req.body.dni,
    address: req.body.address,
    mail: req.body.mail,
    telephone: req.body.telephone,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined){ 
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

export async function addUser(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput
    const userInput = new User(
      input.name,
      input.lastname,
      input.dni,
      input.address,
      input.mail,
      input.telephone,
    )
    await createUser(userInput);
    res.status(201).json(userInput);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add user', error });
  }
}

//function findAll(req: Request ,res: Response){
//  res.json({ data: repository.findAll() });
//}
//
//
//function findOne(req: Request ,res: Response){
//  const id = req.params.id
//  const user = repository.findOne({ id })
//
//  if(!user){
//    return res.status(404).send({message: 'User not found.'})
//  }
//
//  res.json({data: user})
//}
//
//
//function add(req: Request, res: Response){
//  const input = req.body.sanitizedInput
//
//  const userInput = new User(
//    input.name,
//    input.lastname,
//    input.dni,
//    input.address,
//    input.mail,
//    input.telephone,
//  )
//
//  const user = repository.add(userInput)
//  return res.status(201).send({message: 'User created', data: user})
//}
//
//export async function getUser(req: Request, res: Response) {
//  try {
//    const userId = req.params.id;
//    const user = await getUserById(userId);
//    if (user) {
//      res.status(200).json(user);
//    } else {
//      res.status(404).json({ message: 'User not found' });
//    }
//  } catch (error) {
//    res.status(500).json({ message: 'Failed to fetch user', error });
//  }
//}
//
//function update(req: Request ,res: Response){
//  req.body.sanitizedInput.id = req.params.id
//  const user = repository.update(req.body.sanitizedInput)
//
//  if(!user){
//    return res.status(404).send({message: "User not found"})
//  }
//
//  return res.status(200).send({message: 'User updated succesfully.', data: user})
//}
//
//
//function eliminate(req: Request ,res: Response){
//  const id = req.params.id
//  const user = repository.delete({id})
//
//  if(!user) {
//    res.status(404).send({message: "User not found"})
//  } else{
//    return res.status(200).send({message: "User deleted succesfully"})
//  }
//
//}
//
//export { sanitizeUserInput, findAll, findOne, add, update, eliminate}
