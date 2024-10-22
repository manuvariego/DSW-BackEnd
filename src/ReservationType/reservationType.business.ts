import { ReservationType, typeCode } from "./reservationType.entity.js";
import { getReservationTypeByGarageRepository } from "./reservationType.repository.js"

const getPriceByGarageBusiness = async (cuitGarage: number, reservationsHours: number) => {
  const pricing = await getReservationTypeByGarageRepository(cuitGarage);
  const type = getTypeOfReservationByHours(reservationsHours);
  const price = calculatePriceByType(reservationsHours, type, pricing);
  return price;
}

const getTypeOfReservationByHours = (hours: number): typeCode => {
  switch (true) {
    case (hours < 12): return 'HOUR';
    case (hours < 24): return 'HALF_DAY';
    case (hours < 168): return 'DAY';
    case (hours < 360): return 'WEEKLY';
    case (hours < 720): return 'HALF_MONTH';
    case (hours >= 720): return 'MONTH';
    default: return 'HOUR';
  }
}

const calculatePriceByType = (hours: number, type: typeCode, pricing: ReservationType[]): number => {
  
  if (type === 'HOUR') {
    return (hours * getPriceByType(pricing, 'HOUR') < getPriceByType(pricing, 'HALF_DAY')) ?
        hours * getPriceByType(pricing, 'HOUR') : getPriceByType(pricing, 'HALF_DAY');

  } else if (type === 'HALF_DAY') {
    return (getPriceByType(pricing, 'HALF_DAY') + (hours - 12) * getPriceByType(pricing, 'HOUR') < getPriceByType(pricing, 'DAY')) ?
        getPriceByType(pricing, 'HALF_DAY') + (hours - 12) * getPriceByType(pricing, 'HOUR') :
        getPriceByType(pricing, 'DAY');

  } else if (type === 'DAY') {
    return (getPriceByType(pricing, 'DAY') * getDaysByHours(hours) < getPriceByType(pricing, 'WEEKLY')) ?
        getPriceByType(pricing, 'DAY') * getDaysByHours(hours) :
        getPriceByType(pricing, 'WEEKLY');

  } else if (type === 'WEEKLY') {    //getDaysByHours(hours - 360) esto es el excedente de una semana
    return (getPriceByType(pricing, 'WEEKLY') + getPriceByType(pricing, 'DAY') * getDaysByHours(hours - 360) < getPriceByType(pricing, 'HALF_MONTH')) ?
        getPriceByType(pricing, 'WEEKLY') + getPriceByType(pricing, 'DAY') * getDaysByHours(hours - 360) :
        getPriceByType(pricing, 'HALF_MONTH');
        
  } else if (type === 'HALF_MONTH') {
    return (getPriceByType(pricing, 'HALF_MONTH') + getPriceByType(pricing, 'DAY') * getDaysByHours(hours - 720) < getPriceByType(pricing, 'MONTH')) ?
        getPriceByType(pricing, 'HALF_MONTH') + getPriceByType(pricing, 'DAY') * getDaysByHours(hours - 720) :
        getPriceByType(pricing, 'MONTH');
        
  } else {
    return getPriceByType(pricing, 'MONTH') + calculatePriceByType(hours - 720, getTypeOfReservationByHours(hours - 720), pricing);
  }
  
}

const getPriceByType = (pricing: ReservationType[], type: typeCode): number => {
  return pricing.find(x => x.description === type)!.price;
}

const getDaysByHours = (hours: number): number => {
  return Math.ceil(hours / 24);
}

export { getPriceByGarageBusiness }