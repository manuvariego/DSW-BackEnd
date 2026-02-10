import cron from 'node-cron';
import { orm } from '../db/orm.js';
import { Reservation, ReservationStatus } from '../../Reservation/reservation.entity.js';

export function startReservationCron() {
    // Corre cada hora (minuto 0 de cada hora)
    // Formato: minuto hora día mes díaSemana
    // '0 * * * *' = minuto 0, cualquier hora, cualquier día
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Verificando reservas...');
        
        const em = orm.em.fork();
        const now = new Date();
        
        // 1. Reservas activas cuyo check_in ya pasó pero check_out no → en_curso
        const inProgressReservations = await em.find(Reservation, {
            estado: ReservationStatus.ACTIVE,
            check_in_at: { $lte: now },
            check_out_at: { $gt: now }
        });

        for (const reservation of inProgressReservations) {
            reservation.estado = ReservationStatus.IN_PROGRESS;
        }

        // 2. Reservas activas o en_curso cuyo check_out ya pasó → completada
        const expiredReservations = await em.find(Reservation, {
            estado: { $in: [ReservationStatus.ACTIVE, ReservationStatus.IN_PROGRESS] },
            check_out_at: { $lte: now }
        });
        
        for (const reservation of expiredReservations) {
            reservation.estado = ReservationStatus.COMPLETED;
        }
        
        await em.flush();
        console.log(`[CRON] ${inProgressReservations.length} reservas en curso, ${expiredReservations.length} completadas`);
    });
    
    console.log('[CRON] Tarea de reservas programada (cada hora)');
}