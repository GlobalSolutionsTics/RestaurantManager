type DishDescription = {
  image: string;
  isUniquePrice: boolean;
  name: string;
  number: number | string;
  price: number;
  status: string;
  type: string;
  uuid: string;
};

export type Order = {
  creatAt: string;
  discount: string;
  dishes: number;
  dishesDescription: DishDescription[];
  name: string;
  orderId: number;
  payWith: string;
  paymentType: string;
  propine: string;
  status: string;
  tableNumber: number;
  updateAt: string;
  uuid: string;
  waiter: string;
  createdAtTmp: string;
  createAtHour: string;
  createAtDay: number;
  createdAtFullTm: string;
  createAtTime: number;
  total: number;
  shift: number;
};

export type FinancialResponse = {
  date: string;
  data: Order[];
};

export type TableSales = {
  day: number;
  total: number;
};

export type TableSalesHour = {
  hour: string;
  total: number;
};

export type TableSalesDishes = {
  uuid: string;
  name: string;
  units: number;
  price: number;
  total: number;
};
