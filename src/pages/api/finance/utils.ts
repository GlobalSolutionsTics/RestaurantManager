import {
  formatDate,
  formatHour,
  getTotalDish,
  processDateFormat,
} from "@/utils/formats";
import { DbFormatDate } from "./types";

/**
 * Genera una lista de fechas a partir de la fecha inicial
 * @param init Initial Date
 * @param end End Date
 * @returns Date[]
 */
export const generateDates = (init: Date, end: Date): Date[] => {
  const dates = [];
  const currentDate = new Date(init);
  currentDate.setHours(-6, 0, 0, 0);
  end = new Date(end);
  end.setHours(0, 0, 0, 0);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const generateFormatedDateForBD = (
  init: Date,
  end: Date,
): DbFormatDate[] => {
  const dates = generateDates(init, end);
  const mapper = dates.map((date) => processDateFormat(date));
  return mapper;
};

export const processOrderForFS = (orders: any) => {
  const dataPreprocesed = Object.values(orders);
  const data = dataPreprocesed.map((itm: any) => ({
    ...itm,
    createdAtTmp: formatDate(itm.creatAt),
    createAtHour: formatHour(itm.creatAt),
    createAtDay: new Date(itm.creatAt).getDay(),
    createdAtFullTm: new Date(itm.creatAt).toLocaleString("es-MX"),
    createAtTime: new Date(itm.creatAt).getTime(),
    total: getTotalDish(itm.dishesDescription),
  }));
  return data;
};
