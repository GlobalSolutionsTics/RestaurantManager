import { OrdersDishesStatus } from "@/enums/orders.enum";
import { isDishFinished } from "@/utils/kitchenOrder";
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
  preparing: number;
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
      preparing: 0,
    };
    const quantity = Number(dish.number) || 0;
    group.number += quantity;
    if (isDishFinished(dish.status)) {
      group.ready += quantity;
    } else {
      group.pending += quantity;
      if (dish.status === OrdersDishesStatus.IN_PREPARATION) {
        group.preparing += quantity;
      }
    }
    groups.set(key, group);
  }

  return Array.from(groups.values());
}
