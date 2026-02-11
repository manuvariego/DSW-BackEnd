import { Router } from 'express';
import { findAll, add, update, remove, sanitizeServiceInput } from './service.controller.js';
import { authenticate } from "../shared/middleware/auth.middleware.js";

export const serviceRouter = Router();

serviceRouter.get('/', authenticate, findAll);
serviceRouter.post('/', authenticate, sanitizeServiceInput, add);
serviceRouter.put('/:id', authenticate, sanitizeServiceInput, update);
serviceRouter.delete('/:id', authenticate, remove);