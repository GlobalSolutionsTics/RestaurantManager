import { StatusEnum } from "@/enums/states.enum";
import type {
  DinersDivisioTotal,
  UpdateDinersDivisionRequest,
} from "@/pages/api/types/Order/order.type";
import type { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { getOrderDishKey, groupOrderDishes } from "@/utils/groupOrderDishes";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, runTransaction } from "firebase/database";

export async function updateDinersDivision(
  orderId: string,
  waiter: string,
  { diners, allocations }: UpdateDinersDivisionRequest,
) {
  await signInAnonymously(getAuth());
  const { fullDate } = getActualDateDB();
  const orderRef = ref(
    realtimeDB,
    `${RT_ORDER_TABLE_NAME}/${fullDate}/${orderId}`,
  );
  const state: { outcome: "saved" | "conflict" | "missing" } = {
    outcome: "missing",
  };

  const result = await runTransaction(
    orderRef,
    (order: TResponseOrders | null) => {
      state.outcome = "missing";
      if (order?.uuid !== orderId || order.waiter !== waiter) return order;

      state.outcome = "conflict";
      if (
        order.status === StatusEnum.CLOSED ||
        order.status === StatusEnum.CANCELED
      )
        return order;
      const currentDiners = Number(order.diners);
      if (
        Number.isSafeInteger(currentDiners) &&
        currentDiners > 0 &&
        diners !== currentDiners
      ) {
        return order;
      }

      const dishes = order.dishesDescription ?? [];
      const original = new Map(
        dishes.map((dish) => [getOrderDishKey(dish), dish]),
      );
      const remaining = new Map(
        groupOrderDishes(dishes).map((dish) => [dish.key, dish.number]),
      );
      const division: DinersDivisioTotal[] = [];

      for (const allocation of allocations) {
        const assigned = [];
        let totalCents = 0;
        for (const { key, number } of allocation.dishes) {
          const dish = original.get(key);
          const available = remaining.get(key) ?? 0;
          if (!dish || !Number.isFinite(dish.price) || number > available)
            return order;

          remaining.set(key, available - number);
          const { status, ...billDish } = dish;
          assigned.push({ ...billDish, number });
          totalCents += Math.round(dish.price * 100) * number;
        }
        if (assigned.length) {
          division.push({
            diner: allocation.diner,
            dishes: assigned,
            total: totalCents / 100,
          });
        }
      }

      state.outcome = "saved";
      return {
        ...order,
        diners,
        dinersDivisionTotal: division.length ? division : null,
      };
    },
    { applyLocally: false },
  );

  if (!result.committed) throw new Error("La transacción no se confirmó");
  return state.outcome;
}
