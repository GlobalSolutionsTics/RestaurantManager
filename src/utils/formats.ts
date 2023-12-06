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
  const divi = Math.round(val / 10);
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
