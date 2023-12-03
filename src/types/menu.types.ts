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

export type TResponseOrders = {
  name: string;
  dishes: number;
  uuid: string;
  tableNumber: number;
  dishesDescription: Array<TMenuResponse & { number: number }>;
  status: string;
  waiter?: string;
};
