import type { TMenuResponse } from "@/types/menu.types";
import { StatusEnum } from "@/enums/states.enum";

export type DishesWithOrder = TMenuResponse & {
  number: number;
};

export type DinersDivisioTotal = {
  diner: number;
  dishes: DishesWithOrder[];
  total: number;
};

export type UpdateDinersDivisionRequest = {
  diners: number;
  allocations: {
    diner: number;
    dishes: { key: string; number: number }[];
  }[];
};

export type TOrder = {
  name: string;
  diners: number;
  dinersDivisionTotal?: DinersDivisioTotal[];
  dishes: number;
  dishesDescription: DishesWithOrder[];
  orderId: number;
  tableNumber: number;
  status: StatusEnum;
  uuid: string;
  waiter: string;
  version?: number;
};

type OrderDish = TMenuResponse & { number?: number };

type DishModification = {
  orderUUID: string;
  dishesDescription: OrderDish[];
};

export type AddDishesRequest = {
  modifications: DishModification & { submissionId: string };
  waiter: string;
};

export type EditDishesRequest = {
  modifications: DishModification & { originalDishes: OrderDish[] };
  waiter: string;
};
