import type { KitchenOrderAction } from "@/utils/kitchenOrder";
import { TResponseOrders } from "@/types/menu.types";

export enum OrdersStatusEnum {
  ACTIVE = "ACTIVAS",
  READY = "LISTAS",
  CLOSE = "CERRADAS",
}

export type Props = {
  itm: TResponseOrders;
  kitchenType?: string;
  onClick: (val: TResponseOrders, action: KitchenOrderAction) => Promise<void>;
};
