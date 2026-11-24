const getNumber = (antval: number, val: string): number => {
  const number = Number(val);
  if (!isNaN(number)) return number;

  return antval;
};
