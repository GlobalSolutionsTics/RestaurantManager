import { TResponseOrders } from "@/types/menu.types";

export enum OrdersStatusEnum {
  ACTIVE = "ACTIVAS",
  READY = "LISTAS",
  CLOSE = "CERRADAS",
}

export type Props = {
  itm: TResponseOrders;
  onClick: (val: TResponseOrders) => Promise<void>;
};
