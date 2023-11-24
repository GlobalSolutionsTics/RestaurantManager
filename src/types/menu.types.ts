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

export type TOrderResponse = {
  name: string;
  price: number;
  numberDishes: number;
};
