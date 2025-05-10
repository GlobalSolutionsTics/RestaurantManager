import {
  formatDate,
  formatHour,
  getTotalDish,
  processDateFormat,
} from "@/utils/formats";
import { DbFormatDate } from "./types";
import dayjs from "@lib/dayjs";

/**
 * Genera una lista de fechas a partir de la fecha inicial
 * @param init Initial Date
 * @param end End Date
 * @returns Date[]
 */
export const generateDates = (init: Date, end: Date): string[] => {
  const dates: string[] = [];

  let current = dayjs(init).tz("America/Mexico_City").startOf("day");
  const final = dayjs(end).tz("America/Mexico_City").endOf("day");

  while (current.isBefore(final) || current.isSame(final, "day")) {
    dates.push(current.format("YYYY-MM-DD")); // zona horaria segura
    current = current.add(1, "day");
  }

  return dates;
};

export const generateFormatedDateForBD = (
  init: Date,
  end: Date,
): DbFormatDate[] => {
  const dates = generateDates(init, end);
  const mapper = dates.map((date) => processDateFormatFS(date));
  return mapper;
};

export const processDateFormatFS = (dateString: string) => {
  const date = dayjs.tz(dateString, "YYYY-MM-DD", "America/Mexico_City");

  const yyyy = date.year();
  const mm = String(date.month() + 1).padStart(2, "0");
  const dd = String(date.date()).padStart(2, "0");

  return {
    year: yyyy.toString(),
    month: mm,
    day: dd,
    fullDate: `${yyyy}/${mm}/${dd}`,
  };
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
