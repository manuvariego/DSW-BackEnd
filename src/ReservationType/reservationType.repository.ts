import { orm } from "../shared/db/orm.js";
import { ReservationType } from "./reservationType.entity.js";

const em = orm.em

const getReservationTypeByGarageRepository = async (cuitGarage: number): Promise<ReservationType[]> => {
    const reservationTypes = await em.find(ReservationType, {
        garage: {
            cuit: cuitGarage
        }
    });

    return reservationTypes;
}

export { getReservationTypeByGarageRepository }