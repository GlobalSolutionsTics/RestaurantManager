import { DbFormatDate } from "@/pages/api/finance/types";
import { TMenuResponse } from "@/types/menu.types";
import dayjs from "@lib/dayjs";

export const currencyFormat = (val: number) => {
  const newValue = Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(val);
  return newValue;
};

const smallNumbers = [
  "cero",
  "un",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciséis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
  "veinte",
  "veintiún",
  "veintidós",
  "veintitrés",
  "veinticuatro",
  "veinticinco",
  "veintiséis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
];
const tens = [
  "",
  "",
  "",
  "treinta",
  "cuarenta",
  "cincuenta",
  "sesenta",
  "setenta",
  "ochenta",
  "noventa",
];
const hundreds = [
  "",
  "ciento",
  "doscientos",
  "trescientos",
  "cuatrocientos",
  "quinientos",
  "seiscientos",
  "setecientos",
  "ochocientos",
  "novecientos",
];

const integerToWords = (value: number): string => {
  if (value < 30) return smallNumbers[value];
  if (value < 100) {
    const remainder = value % 10;
    return (
      tens[Math.floor(value / 10)] +
      (remainder ? ` y ${smallNumbers[remainder]}` : "")
    );
  }
  if (value === 100) return "cien";

  const scale =
    value >= 1e12 ? 1e12 : value >= 1e6 ? 1e6 : value >= 1000 ? 1000 : 100;
  const count = Math.floor(value / scale);
  const remainder = value % scale;
  const suffix = remainder ? ` ${integerToWords(remainder)}` : "";
  if (scale === 100) return hundreds[count] + suffix;
  if (scale === 1000)
    return (count === 1 ? "mil" : `${integerToWords(count)} mil`) + suffix;
  const label =
    scale === 1e12
      ? count === 1
        ? "billón"
        : "billones"
      : count === 1
        ? "millón"
        : "millones";
  return `${integerToWords(count)} ${label}${suffix}`;
};

const amountFormatter = new Intl.NumberFormat("en", {
  useGrouping: false,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const textToString = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Cero pesos";
  const parts = amountFormatter.formatToParts(Math.abs(value));
  const pesos = Number(parts.find((part) => part.type === "integer")?.value);
  const cents = Number(parts.find((part) => part.type === "fraction")?.value);
  const sign = value < 0 && (pesos || cents) ? "menos " : "";
  const unit = pesos === 1 ? "peso" : "pesos";
  const connector = pesos > 0 && pesos % 1e6 === 0 ? " de " : " ";
  const centavos =
    cents > 0
      ? ` con ${integerToWords(cents)} ${cents === 1 ? "centavo" : "centavos"}`
      : "";
  const text = `${sign}${integerToWords(pesos)}${connector}${unit}${centavos}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (date: string) => {
  const datePreprocesed = new Date(date);
  const yyyy = datePreprocesed.getFullYear();
  let mm: number | string = datePreprocesed.getMonth() + 1; // Months start at 0!
  let dd: number | string = datePreprocesed.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return yyyy + "/" + mm + "/" + dd;
};

export const formattingDateTime = (date: number) => {
  const datePreprocesed = new Date(date);
  const yyyy = datePreprocesed.getFullYear();
  let mm: number | string = datePreprocesed.getMonth() + 1; // Months start at 0!
  let dd: number | string = datePreprocesed.getDate();

  const hours = [
    datePreprocesed.getHours(),
    datePreprocesed.getMinutes(),
    datePreprocesed.getSeconds(),
  ].join(":");

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return yyyy + "/" + mm + "/" + dd + " " + hours;
};

export const getActualDateDB = (): {
  year: string;
  month: string;
  day: string;
  fullDate: string;
} => {
  const date = new Date();
  return processDateFormat(date);
};

export const formatHour = (date: string) => {
  const newFromat = new Date(date).toLocaleString("es-MX");
  const separate = newFromat.split(" ");
  const pointsSeparate = separate[1].split(":");
  const hour = pointsSeparate[0];
  return hour;
};

export const formatDateTime = (date: string) => {
  const datePreprocesed = new Date(date).toLocaleString();
  return datePreprocesed;
};

export const getTotalDish = (
  dishes: Array<TMenuResponse & { number: number }>,
) => {
  if (dishes !== undefined) {
    const total = dishes.reduce(
      (prev, itm) => prev + itm.price * itm.number,
      0,
    );
    return total;
  }
  return 0;
};

/**
 * Procesa las fechas para tenerlas del tipo DbFormatDate
 * @param date Fecha
 * @returns DbFormatDate
 */
export const processDateFormat = (date: Date): DbFormatDate => {
  const datePreprocesed = dayjs(date).tz("America/Mexico_City");
  const yyyy = datePreprocesed.year();
  const mm = String(datePreprocesed.month() + 1).padStart(2, "0"); // month() is 0-based
  const dd = String(datePreprocesed.date()).padStart(2, "0");

  return {
    year: yyyy.toString(),
    month: mm,
    day: dd,
    fullDate: `${yyyy}/${mm}/${dd}`,
  };
};

export const DateISOFormat = (date: Date): Date => {
  const datePreprocesed = new Date(
    date.setTime(date.getTime() - 6 * 60 * 60 * 1000),
  );
  return datePreprocesed;
};

export const getFloat = (value: any): number => {
  let val = 0;
  const parser = parseFloat(value ?? 0);
  if (!isNaN(parser)) val = parser;
  return val;
};
