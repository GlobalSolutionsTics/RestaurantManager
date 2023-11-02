export type TMenuResponse = {
  name: string;
  price: number;
  isUniquePrice: boolean;
  type: string;
};

export type TResponseCollection = {
  data: Array<TMenuResponse>;
};

export type TMenu = {
  name: string;
  price: number;
};
