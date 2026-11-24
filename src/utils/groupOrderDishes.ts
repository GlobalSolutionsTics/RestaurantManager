import { separateVariablePriceUnits } from "@/utils/orderDishNotes";
import { OrdersDishesStatus } from "@/enums/orders.enum";
import { isDishFinished } from "@/utils/kitchenOrder";
import type { TResponseOrders } from "@/types/menu.types";

type OrderDish = TResponseOrders["dishesDescription"][number];

export function getOrderDishKey(
  dish: Pick<OrderDish, "uuid" | "name" | "price" | "type">,
) {
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
  notes?: string;
};

export function groupOrderDishes(
  dishes?: TResponseOrders["dishesDescription"],
  kitchenView = false,
) {
  const groups = new Map<string, GroupedDish>();

  const rows = kitchenView
    ? separateVariablePriceUnits(dishes ?? [])
    : dishes ?? [];
  rows.forEach((dish, index) => {
    const notes = kitchenView ? dish.notes?.trim() : undefined;
    const dishKey = getOrderDishKey(dish);
    const key =
      kitchenView && dish.isUniquePrice
        ? JSON.stringify([dishKey, notes, index])
        : notes
          ? JSON.stringify([dishKey, notes])
          : dishKey;
    const group = groups.get(key) ?? {
      key,
      name: dish.name,
      price: dish.price,
      number: 0,
      pending: 0,
      ready: 0,
      preparing: 0,
      ...(notes && { notes }),
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
  });

  return Array.from(groups.values());
}
