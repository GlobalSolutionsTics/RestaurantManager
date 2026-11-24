import { OrdersDishesStatus } from "@/enums/orders.enum";
import type { TResponseOrders } from "@/types/menu.types";

type OrderDish = TResponseOrders["dishesDescription"][number];

export function getOrderDishKey(dish: OrderDish) {
  return JSON.stringify([dish.uuid, dish.name, dish.price, dish.type]);
}

type GroupedDish = {
  key: string;
  name: string;
  price: number;
  number: number;
  pending: number;
  ready: number;
};

export function groupOrderDishes(
  dishes?: TResponseOrders["dishesDescription"],
) {
  const groups = new Map<string, GroupedDish>();

  for (const dish of dishes ?? []) {
    const key = getOrderDishKey(dish);
    const group = groups.get(key) ?? {
      key,
      name: dish.name,
      price: dish.price,
      number: 0,
      pending: 0,
      ready: 0,
    };
    const quantity = Number(dish.number) || 0;
    group.number += quantity;
    if (dish.status === OrdersDishesStatus.READY) {
      group.ready += quantity;
    } else {
      group.pending += quantity;
    }
    groups.set(key, group);
  }

  return Array.from(groups.values());
}
