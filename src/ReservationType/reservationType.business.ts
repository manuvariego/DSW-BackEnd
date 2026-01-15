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
  const hourPrice = getPriceByType(pricing, 'HOUR');
  const halfDayPrice = getPriceByType(pricing, 'HALF_DAY');
  const dayPrice = getPriceByType(pricing, 'DAY');
  const weeklyPrice = getPriceByType(pricing, 'WEEKLY');
  const halfMonthPrice = getPriceByType(pricing, 'HALF_MONTH');
  const monthPrice = getPriceByType(pricing, 'MONTH');

  if (type === 'HOUR') {
    // Compare: hourly rate vs half-day flat rate
    const hourlyTotal = hours * hourPrice;
    return Math.min(hourlyTotal, halfDayPrice);

  } else if (type === 'HALF_DAY') {
    // Compare: half-day + extra hours vs day flat rate
    const excessHours = hours - 12;
    const halfDayTotal = halfDayPrice + (excessHours * hourPrice);
    return Math.min(halfDayTotal, dayPrice);

  } else if (type === 'DAY') {
    // Compare: daily rate * days vs weekly flat rate
    const days = getDaysByHours(hours);
    const dailyTotal = dayPrice * days;
    return Math.min(dailyTotal, weeklyPrice);

  } else if (type === 'WEEKLY') {
    // Compare: weekly + extra days vs half-month flat rate
    const excessHours = hours - 168; // 7 days in hours
    const excessDays = getDaysByHours(excessHours);
    const weeklyTotal = weeklyPrice + (dayPrice * excessDays);
    return Math.min(weeklyTotal, halfMonthPrice);

  } else if (type === 'HALF_MONTH') {
    // Compare: half-month + extra days vs month flat rate
    const excessHours = hours - 360; // 15 days in hours
    const excessDays = getDaysByHours(excessHours);
    const halfMonthTotal = halfMonthPrice + (dayPrice * excessDays);
    return Math.min(halfMonthTotal, monthPrice);

  } else { // MONTH
    // For months: month rate + recursively calculate excess
    const excessHours = hours - 720; // 30 days in hours
    const excessType = getTypeOfReservationByHours(excessHours);
    const excessPrice = calculatePriceByType(excessHours, excessType, pricing);
    return monthPrice + excessPrice;
  }
}

const getPriceByType = (pricing: ReservationType[], type: typeCode): number => {
  return pricing.find(x => x.description === type)!.price;
}

const getDaysByHours = (hours: number): number => {
  return Math.ceil(hours / 24);
}

export { getPriceByGarageBusiness }