import { TMenuResponse } from "@/types/menu.types";

export const currencyFormat = (val: number) => {
  const newValue = Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(val);
  return newValue;
};

const units = (val: number) => {
  switch (val) {
    case 1:
      return "un";
    case 2:
      return "dos";
    case 3:
      return "tres";
    case 4:
      return "cuatro";
    case 5:
      return "cinco";
    case 6:
      return "seis";
    case 7:
      return "siete";
    case 8:
      return "ocho";
    case 9:
      return "nueve";
    default:
      return "";
  }
};

const principalDecimal = (rest: number) => {
  switch (rest) {
    case 0:
      return "diez";
    case 1:
      return "once";
    case 2:
      return "doce";
    case 3:
      return "trece";
    case 4:
      return "catorce";
    case 5:
      return "quince";
    default:
      return "dieci" + units(rest);
  }
};

const decimals = (val: number) => {
  const rest = val % 10;
  const divi = Math.floor(val / 10);
  switch (divi) {
    case 1:
      return principalDecimal(rest);
    case 2:
      if (rest === 0) {
        return "veinte";
      } else {
        return "veinti" + units(rest);
      }
    case 3:
      if (rest === 0) {
        return "treinta";
      } else {
        return "treinta y " + units(rest);
      }
    case 4:
      if (rest === 0) {
        return "cuarenta";
      } else {
        return "cuarenta y " + units(rest);
      }
    case 5:
      if (rest === 0) {
        return "cincuenta";
      } else {
        return "cincuenta y " + units(rest);
      }
    case 6:
      if (rest === 0) {
        return "sesenta";
      } else {
        return "sesenta y " + units(rest);
      }
    case 7:
      if (rest === 0) {
        return "setenta";
      } else {
        return "setenta y " + units(rest);
      }
    case 8:
      if (rest === 0) {
        return "ochenta";
      } else {
        return "ochenta y " + units(rest);
      }
    case 9:
      if (rest === 0) {
        return "noventa";
      } else {
        return "noventa y " + units(rest);
      }
    default:
      return units(rest);
  }
};

const centcimals = (val: number) => {
  const rest = val % 100;
  const divi = Math.floor(val / 100);
  switch (divi) {
    case 0:
      return decimals(rest);
    case 1:
      if (rest === 0) {
        return "cien";
      }
      return "ciento " + decimals(rest);
    case 5:
      return "quinientos " + decimals(rest);
    case 9:
      return "novecientos " + decimals(rest);
    default:
      return units(divi) + "cientos " + decimals(rest);
  }
};

const milesimas = (val: number) => {
  const rest = val % 1000;
  const divi = Math.floor(val / 1000);
  switch (divi) {
    case 0:
      return centcimals(rest);
    case 1:
      return "mil " + centcimals(rest);
    default:
      return centcimals(divi) + " mil " + centcimals(rest);
  }
};

export const textToString = (val: number) => {
  const value = milesimas(val);
  return value.charAt(0).toUpperCase() + value.slice(1);
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

export const getActualDateDB = (): {
  year: string;
  month: string;
  day: string;
  fullDate: string;
} => {
  const date = new Date();
  const datePreprocesed = new Date(
    date.setTime(date.getTime() - 6 * 60 * 60 * 1000),
  );
  const yyyy = datePreprocesed.getFullYear();
  let mm: number | string = datePreprocesed.getMonth() + 1; // Months start at 0!
  let dd: number | string = datePreprocesed.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return {
    year: yyyy.toString(),
    month: mm.toString(),
    day: dd.toString(),
    fullDate: yyyy + "/" + mm + "/" + dd,
  };
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
