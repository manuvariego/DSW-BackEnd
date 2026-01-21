import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { orm } from "../shared/db/orm.js";
import { User } from "../User/user.entity.js";
import { Garage } from "../Garage/garage.entity.js";

const em = orm.em;

async function login(req: Request, res: Response) {
    try {
        const { dni, password } = req.body;

        if (!dni || !password) {
            return res.status(400).json({ message: 'DNI and password are required' });
        }

        // Primero buscar en la tabla de usuarios por DNI
        const user = await em.findOne(User, { dni: dni });

        if (user) {
            // Usuario encontrado, verificar contraseña
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generar token para usuario
            const time = new Date();
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    type: user.role,
                    timeToken: time,
                },
                process.env.JWT_SECRET || 'palabra_secreta' as Secret
            );

            return res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    dni: user.dni,
                    type: user.role
                }
            });
        }

        // Si no se encuentra usuario, buscar en la tabla de garages por CUIT
        const cuitNumber = Number(dni);
        if (isNaN(cuitNumber)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const garage = await em.findOne(Garage, { cuit: cuitNumber });

        if (garage) {
            // Garage encontrado, verificar contraseña
            const match = await bcrypt.compare(password, garage.password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generar token para garage
            const time = new Date();
            const token = jwt.sign(
                {
                    id: garage.cuit,
                    name: garage.name,
                    type: 'garage',
                    timeToken: time,
                },
                process.env.JWT_SECRET || 'palabra_secreta' as Secret
            );

            return res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: garage.cuit,
                    name: garage.name,
                    email: garage.email,
                    cuit: garage.cuit,
                    type: 'garage'
                }
            });
        }

        // No se encontró ni usuario ni garage
        return res.status(401).json({ message: 'Invalid credentials' });

    } catch (error: any) {
        console.error('Login error:', error);
        return res.status(500).json({ message: error.message });
    }
}

export { login };
