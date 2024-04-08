export type TExpenses = {
  name: string;
  price: number;
  uuid?: string;
};

export type TResponseCollection = {
  data: Array<TExpenses>;
};
