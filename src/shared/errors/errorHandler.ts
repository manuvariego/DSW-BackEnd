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

    // Si es un error de FK (intento de borrar algo que tiene referencias)
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ message: 'No se puede eliminar porque está siendo utilizado por otro recurso' });
    }

    // Error genérico del servidor
    console.error('Server error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
}
