import { Router } from 'express';
import { findAll, add, update, remove, findByGarage, sanitizeServiceInput } from './service.controller.js';

export const serviceRouter = Router();

serviceRouter.get('/', findAll);
serviceRouter.get('/garage/:garageCuit', findByGarage);
serviceRouter.post('/', sanitizeServiceInput, add);
serviceRouter.put('/:id', sanitizeServiceInput, update);
serviceRouter.delete('/:id', remove);