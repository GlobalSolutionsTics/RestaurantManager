import type { TMenuResponse } from "@/types/menu.types";
import type { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusEnum } from "@/enums/states.enum";

export type DishesWithOrder = TMenuResponse & {
  number: number;
  notes?: string;
  status?: OrdersDishesStatus;
  preparingKitchen?: string;
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
  notes?: string;
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

type OrderDish = Omit<DishesWithOrder, "number"> & { number?: number };

type DishModification = {
  orderUUID: string;
  dishesDescription: OrderDish[];
};

export type AddDishesRequest = {
  modifications: DishModification & { submissionId: string; notes?: string };
  waiter: string;
};

export type EditDishesRequest = {
  modifications: DishModification & { originalDishes: OrderDish[] };
  waiter: string;
};
