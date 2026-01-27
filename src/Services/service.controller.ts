import { Request, Response, NextFunction } from "express";
import * as serviceBusiness from "./service.business.js";
import { Service } from "./service.entity.js";


function sanitizeServiceInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        description: req.body.description,
        price: req.body.price,
        garageCuit: req.body.garageCuit
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
        const services = await serviceBusiness.getAllServices();
        res.status(200).json(services);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const service = await serviceBusiness.getServiceById(id);
        res.status(200).json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;
        
        const newService = await serviceBusiness.createService(
            input.garageCuit, 
            input.description, 
            Number(input.price)
        );
        
        res.status(201).json({ message: "Servicio creado", data: newService });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const input = req.body.sanitizedInput;
        
        const updatedService = await serviceBusiness.updateService(id, input);
        
        res.status(200).json({ message: "Servicio actualizado", data: updatedService });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        await serviceBusiness.deleteService(id);
        res.status(200).json({ message: "Servicio eliminado" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { sanitizeServiceInput, findAll, findOne, add, update, remove }