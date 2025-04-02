import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"

export const auth = (req: Request, res: Response, next: NextFunction) => {

    const token: string | undefined = req.header("Authorization")?.replace('Bearer ', '')

    if (!token) {
        return res.status(403).json({ message: "Access denied" })
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        if (typeof decoded == "object") {
            if (decoded.type == "user") {
                res.locals.user = decoded
            } else {
                res.locals.garage = decoded
            }
            next()
        }
    } catch (err) {


        return res.status(401).json({ message: "Invalid token" })
    }
};
