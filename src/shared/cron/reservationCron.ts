import cron from 'node-cron';
import { orm } from '../db/orm.js';
import { Reservation, ReservationStatus } from '../../Reservation/reservation.entity.js';

export function startReservationCron() {
    // Corre cada hora (minuto 0 de cada hora)
    // Formato: minuto hora día mes díaSemana
    // '0 * * * *' = minuto 0, cualquier hora, cualquier día
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Verificando reservas vencidas...');
        
        // Crear un fork del EntityManager para esta tarea
        const em = orm.em.fork();
        const now = new Date();
        
        // Buscar reservas activas con checkout en el pasado
        const expiredReservations = await em.find(Reservation, {
            estado: ReservationStatus.ACTIVE,
            check_out_at: { $lt: now }
        });
        
        // Actualizar cada una a completada
        for (const reservation of expiredReservations) {
            reservation.estado = ReservationStatus.COMPLETED;
        }
        
        await em.flush();
        console.log(`[CRON] ${expiredReservations.length} reservas marcadas como completadas`);
    });
    
    console.log('[CRON] Tarea de reservas programada (cada hora)');
}