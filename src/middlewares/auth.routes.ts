import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { orm } from '../shared/db/orm.js'
import { User } from '../User/user.entity.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

// Login Route
router.post('/login', async (req, res) => {
    const { dni, password } = req.body;

    try {
        const user = await orm.em.findOne(User, { dni });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generate JWT Token including role
        const token = jwt.sign(
            { id: user.id, dni: user.dni, name:user.name, role: user.role },  // Include role
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });  // Send role to frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// User Registration Route (optional)
router.post('/register', async (req, res) => {
    const { dni, name, lastname, address, email, phoneNumber, password } = req.body

    try {
        const existingUser = await orm.em.findOne(User, { dni })
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = orm.em.create(User, {
            dni,
            password: hashedPassword,
            name: name,     
            lastname: lastname,        
            address: address,     
            email: email, 
            phoneNumber: phoneNumber, 
            role: 'USER'
          });
        await orm.em.persistAndFlush(newUser)

        res.json({ message: 'Usuario registrado exitosamente' })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("🔥 Register Error:", error.message);
            res.status(500).json({ error: error.message });
        } else {
            console.error("🔥 Unknown Error:", error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
})

export { router as AuthRouter }