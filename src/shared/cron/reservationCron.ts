import cron from 'node-cron';
import { orm } from '../db/orm.js';
import { Reservation, ReservationStatus } from '../../Reservation/reservation.entity.js';
import { getIO } from '../socket/socket.service.js';

export function startReservationCron() {
    // Corre cada minuto
    // Formato: minuto hora día mes díaSemana
    // '0 * * * *' = minuto 0, cualquier hora, cualquier día
    cron.schedule('* * * * *', async () => {
        
        const em = orm.em.fork();
        const now = new Date();
        
        // 1. Reservas activas cuyo check_in ya pasó pero check_out no → en_curso
        const inProgressReservations = await em.find(Reservation, {
            estado: ReservationStatus.ACTIVE,
            check_in_at: { $lte: now },
            check_out_at: { $gt: now }
        }, { populate: ['vehicle.owner', 'garage'] });

        for (const reservation of inProgressReservations) {
            reservation.estado = ReservationStatus.IN_PROGRESS;
        }

        // 2. Reservas activas o en_curso cuyo check_out ya pasó → completada
        const expiredReservations = await em.find(Reservation, {
            estado: { $in: [ReservationStatus.ACTIVE, ReservationStatus.IN_PROGRESS] },
            check_out_at: { $lte: now }
        }, { populate: ['vehicle.owner', 'garage'] });
        
        for (const reservation of expiredReservations) {
            reservation.estado = ReservationStatus.COMPLETED;
        }
        
        await em.flush();

        // Emitir eventos por WebSocket
        const io = getIO();

        for (const reservation of inProgressReservations) {
            io.to(`garage:${reservation.garage.cuit}`).emit('reservation:inProgress', { reservationId: reservation.id });
            if (reservation.vehicle?.owner?.id) {
                io.to(`user:${reservation.vehicle.owner.id}`).emit('reservation:inProgress', { reservationId: reservation.id });
            }
        }

        for (const reservation of expiredReservations) {
            io.to(`garage:${reservation.garage.cuit}`).emit('reservation:completed', { reservationId: reservation.id });
            if (reservation.vehicle?.owner?.id) {
                io.to(`user:${reservation.vehicle.owner.id}`).emit('reservation:completed', { reservationId: reservation.id });
            }
        }

        console.log(`[CRON] ${inProgressReservations.length} reservas en curso, ${expiredReservations.length} completadas`);
    });
    
    console.log('[CRON] Tarea de reservas programada (cada minuto)');
}