import { StatusEnum } from "@/enums/states.enum";

export type TOrder = {
  name: string;
  dishes: number;
  dishesDescription: Array<any>;
  orderId: number;
  tableNumber: number;
  status: StatusEnum;
  uuid: string;
  waiter: string;
};

export type UOrderReq = {
  modifications: TOrder;
  tableNumber: number;
  status: StatusEnum;
  waiter: string;
  applicationStatus: string;
};
