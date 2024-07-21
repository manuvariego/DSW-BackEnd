import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { itemUser } from "./itemUser.entity.js";

const em = orm.em

async function findAll(req: Request , res: Response){
 try{
    const ItemsUser = await em.find(itemUser, {})
    res.status(200).json({Message: 'Items founded', data:ItemsUser })
    } catch(error:any){res.status(500).json({Message: error.message})}
  }
  
  
async function findOne(req: Request ,res: Response){
 try{
  const id = Number.parseInt(req.params.id)
 const ItemsUser = await em.findOneOrFail(itemUser, {id})
 res.status(200).json({message: 'Item founded', data: ItemsUser})
}catch (error: any){res.status(500).json({message: error.message})}
  } 
  
  
async function add(req: Request, res: Response){
 try{
    const ItemUser = em.create(itemUser, req.body)
    await em.flush()
    res.status(200).json({message: 'Item created', data: ItemUser})
 } catch (error:any){res.status(500).json({message: error.message})}
  }
  
  
async function update(req: Request ,res: Response){
 try{
  const id = Number.parseInt(req.params.id)
  const ItemUser = em.getReference(itemUser, id)
  em.assign(ItemUser, req.body)
  await em.flush()
  res.status(200).json({message: 'Updated'})
} catch (error:any){res.status(500).json({message: error.message})}
  }
  
  
async function eliminate(req: Request ,res: Response){
  try{
  const id = Number.parseInt(req.params.id)
  const ItemUser = em.getReference(itemUser, id)
  await em.removeAndFlush(ItemUser)
  res.status(200).json({Message: 'Deleted'})
  } catch (error:any){ res.status(500).json({message: error.message})}
}
  
export {findAll, findOne, add, update, eliminate}