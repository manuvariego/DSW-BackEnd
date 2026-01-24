import { Router } from "express";
import { login } from "./auth.controller.js";

export const AuthRouter = Router();

AuthRouter.post('/login', login);
