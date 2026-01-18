import { Response } from 'express';
import { NotFoundError } from '@mikro-orm/core';

export function handleError(error: any, res: Response) {
    // Si es un error de MikroORM NotFoundError
    if (error instanceof NotFoundError || error.name === 'NotFoundError') {
        return res.status(404).json({ message: 'Resource not found' });
    }

    // Si es un error de validación de datos únicos (duplicados)
    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('duplicate')) {
        return res.status(409).json({ message: 'Resource already exists' });
    }

    // Error genérico del servidor
    console.error('Server error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
}
