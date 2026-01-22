import { Router } from 'express';
import { findAll, add, update, remove, sanitizeServiceInput } from './service.controller.js';

export const serviceRouter = Router();

serviceRouter.get('/', findAll);
serviceRouter.post('/', sanitizeServiceInput, add); 
serviceRouter.put('/:id', sanitizeServiceInput, update);
serviceRouter.delete('/:id', remove);