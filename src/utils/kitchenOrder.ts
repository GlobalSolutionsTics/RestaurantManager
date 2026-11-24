import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusEnum } from "@/enums/states.enum";
import type { DishesWithOrder } from "@/pages/api/types/Order/order.type";
import type { TResponseOrders } from "@/types/menu.types";

export function isDishFinished(status?: string) {
  return (
    status === OrdersDishesStatus.FINISHED ||
    status === OrdersDishesStatus.READY
  );
}

export function isDishSent(status?: string) {
  return (
    !isDishFinished(status) && status !== OrdersDishesStatus.IN_PREPARATION
  );
}

export function getKitchenIdentity(kitchenType?: string, userId?: string) {
  return kitchenType || (userId ? `user:${userId}` : undefined);
}

export function belongsToKitchen(
  dish: Pick<DishesWithOrder, "kitchenType" | "preparingKitchen">,
  kitchenType?: string,
) {
  const assignedKitchen = dish.kitchenType || dish.preparingKitchen;
  return !assignedKitchen || assignedKitchen === kitchenType;
}

function isKitchenServing(dish: DishesWithOrder, kitchenType?: string) {
  return (
    !!kitchenType &&
    Number(dish.number) > 0 &&
    belongsToKitchen(dish, kitchenType)
  );
}

export type KitchenOrderAction = "prepare" | "finish";

export function getKitchenOrderAction(
  order: TResponseOrders,
  kitchenType?: string,
): KitchenOrderAction | undefined {
  if (
    order.status !== StatusEnum.SEND &&
    order.status !== StatusEnum.EDITED &&
    order.status !== StatusEnum.IN_PROGRESS
  )
    return;

  const dishes = (order.dishesDescription ?? []).filter((dish) =>
    isKitchenServing(dish, kitchenType),
  );
  if (dishes.some((dish) => isDishSent(dish.status))) return "prepare";
  if (
    order.status === StatusEnum.IN_PROGRESS &&
    dishes.some((dish) => dish.status === OrdersDishesStatus.IN_PREPARATION)
  )
    return "finish";
}

export function advanceKitchenOrder(
  order: TResponseOrders,
  kitchenType?: string,
) {
  const action = getKitchenOrderAction(order, kitchenType);
  if (!action) return order;

  const finishing = action === "finish";
  const status = finishing
    ? OrdersDishesStatus.FINISHED
    : OrdersDishesStatus.IN_PREPARATION;
  const dishesDescription = (order.dishesDescription ?? []).map((dish) => {
    const canAdvance = finishing
      ? dish.status === OrdersDishesStatus.IN_PREPARATION
      : isDishSent(dish.status);
    if (!isKitchenServing(dish, kitchenType) || !canAdvance) return dish;
    if (!dish.kitchenType && !dish.preparingKitchen && kitchenType) {
      return { ...dish, status, preparingKitchen: kitchenType };
    }
    return { ...dish, status };
  });

  const allDishesFinished = dishesDescription.every(
    (dish) => Number(dish.number) <= 0 || isDishFinished(dish.status),
  );
  const orderStatus =
    finishing && allDishesFinished
      ? StatusEnum.ORDER_READY
      : StatusEnum.IN_PROGRESS;

  return { ...order, status: orderStatus, dishesDescription };
}
