import type {
  DishesWithOrder,
  TOrder,
} from "@/pages/api/types/Order/order.type";
import { Payment } from "@/components/admin/paymentForm/types";

export type TMenuResponse = {
  name: string;
  price: number;
  isUniquePrice: boolean;
  type: string;
  uuid?: string;
  kitchenType?: string;
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

export type TResponseOrders = Partial<
  Pick<TOrder, "diners" | "dinersDivisionTotal">
> & {
  name: string;
  dishes: number;
  uuid: string;
  tableNumber: number;
  dishesDescription: DishesWithOrder[];
  status: string;
  waiter?: string;
  payWith?: number;
  propine?: number;
  shift?: number;
  discount?: number;
  paymentType?: EButtonActives;
  payment?: Payment;
};
