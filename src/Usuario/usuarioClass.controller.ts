import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { UserClass } from "./usuarioClass.entity.js";

const em = orm.em

async function findAll(req: Request , res: Response){
 try{
    const UserClasses = await em.find(UserClass, {})
    res.status(201).json({Message: 'Classes founded', data:UserClasses })
    } catch(error:any){res.status(500).json({Message: 'no se pudo'})}
}
  
  
async function findOne(req: Request ,res: Response){
 try{
  const id = Number.parseInt(req.params.id)
 const usuarioClass = await em.findOneOrFail(UserClass, {id})
 res.status(200).json({message: 'User class founded', data:usuarioClass})
}catch (error: any){res.status(500).json({message: error.message})}
  } 
  
  
async function add(req: Request, res: Response){
 try{
    const usuarioClass = em.create(UserClass, req.body)
    await em.flush()
    res.status(200).json({message: 'user Class created', data: usuarioClass})
 } catch (error:any){res.status(500).json({message: error.message})}
  }
  
  
async function update(req: Request ,res: Response){
 try{
  const id = Number.parseInt(req.params.id)
  const usuarioClass = em.getReference(UserClass, id)
  em.assign(usuarioClass, req.body)
  await em.flush()
  res.status(200).json({message: 'Updated'})
} catch (error:any){res.status(500).json({message: error.message})}
  }
  
  
async function eliminate(req: Request ,res: Response){
  try{
  const id = Number.parseInt(req.params.id)
  const usuarioClass = em.getReference(UserClass, id)
  await em.removeAndFlush(usuarioClass)
  res.status(200).json({Message: 'Deleted'})
  } catch (error:any){ res.status(500).json({message: error.message})}
}
  
export {findAll, findOne, add, update, eliminate}