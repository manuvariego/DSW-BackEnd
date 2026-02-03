import { Router } from "express";
import { login } from "./auth.controller.js";
import { forgotPassword } from "./auth.controller.js";  

export const AuthRouter = Router();

AuthRouter.post('/login', login);
AuthRouter.post('/forgot-password', forgotPassword);


