export const currencyFormat = (val: number) => {
  const newValue = Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(val);
  return newValue;
};
