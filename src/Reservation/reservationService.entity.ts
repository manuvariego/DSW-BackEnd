import { Entity, ManyToOne, Property, PrimaryKey, Rel } from '@mikro-orm/core';
import { Reservation } from './reservation.entity.js';
import { Service } from '../Services/service.entity.js';

export enum ServiceStatus {
    PENDIENTE = 'pendiente',
    EN_PROGRESO = 'en_progreso',
    COMPLETADO = 'completado'
}

@Entity({ tableName: 'reservation_services' })
export class ReservationService {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Reservation, { fieldName: 'reservation_id' })
    reservation!: Rel<Reservation>;

    @ManyToOne(() => Service, { fieldName: 'service_id' })
    service!: Rel<Service>;

    @Property({ default: ServiceStatus.PENDIENTE })
    status: ServiceStatus = ServiceStatus.PENDIENTE;
}