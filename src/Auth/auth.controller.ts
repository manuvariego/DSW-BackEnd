import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { orm } from "../shared/db/orm.js";
import { User } from "../User/user.entity.js";
import { Garage } from "../Garage/garage.entity.js";
import { sendEmail} from "../shared/mail.service.js"; 
import { handleError } from "../shared/errors/errorHandler.js";

const em = orm.em;

async function login(req: Request, res: Response) {
  try {
    const { dni, password } = req.body;
    if (!dni || !password) {
      return res.status(400).json({ message: 'DNI and password are required' });
    }
    const user = await em.findOne(User, { dni: dni });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // token para usuario
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

    // Si no se encuentra usuario, busca en la tabla de garages por CUIT
    const cuitNumber = Number(dni);
    if (isNaN(cuitNumber)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const garage = await em.findOne(Garage, { cuit: cuitNumber });

    if (garage) {
      const match = await bcrypt.compare(password, garage.password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // token para garage
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

async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await em.findOne(User, { email });

    if (!user) {
      return res.status(200).json({ message: 'Si el email existe, se enviaron las instrucciones.' });
    }
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    user.resetToken = token;
    await em.flush();
    const recoveryLink = `http://localhost:4200/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: 'Recuperar Contraseña - ParkEasy',
      html: `
        <h1>Recuperar Contraseña - ParkEasy</h1>
        <p>Recuperación de contraseña</p>
        <p>Hiciste una solicitud para restablecer tu contraseña.</p>
        <p>Hacé clic en el siguiente enlace para crear una nueva:</p>
        <a href="${recoveryLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <br><br>
        <small>Si no fuiste vos, ignorá este mensaje.</small>
      `
    });

    res.status(200).json({ message: 'Correo enviado con éxito' });

  } catch (error) {
    handleError(error, res);
  }
}

export { login, forgotPassword };
