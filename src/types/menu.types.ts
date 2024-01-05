export type TMenuResponse = {
  name: string;
  price: number;
  isUniquePrice: boolean;
  type: string;
  uuid?: string;
};

export type TResponseCollection = {
  data: Array<TMenuResponse>;
};

export type TMenu = {
  name: string;
  price: number;
};

enum EButtonActives {
  EFECTIVE = "EFECTIVO",
  DEBIT = "TARJETA DE DEBITO",
  CREDIT = "TARJETA DE CREDITO",
  VOUCHER = "VALES",
  COUTERSY = "CORTESIA",
}

export type TResponseOrders = {
  name: string;
  dishes: number;
  uuid: string;
  tableNumber: number;
  dishesDescription: Array<TMenuResponse & { number: number }>;
  status: string;
  waiter?: string;
  payWith?: number;
  propine?: number;
  shift?: number;
  pymentType?: EButtonActives;
};
