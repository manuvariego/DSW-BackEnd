import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | number;
        name: string;
        type: string;
        timeToken: Date;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'palabra_secreta';

/**
 * After this middleware, req.user contains:
 * - id: user ID or garage CUIT
 * - name: user/garage name
 * - type: user role (e.g., 'admin', 'user') or 'garage'
 * - timeToken: token creation timestamp
 *
 * In your controller, check req.user.type for role-based access:
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header required' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization format. Use: Bearer <token>' });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string | number;
      name: string;
      type: string;
      timeToken: Date;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
}
