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
