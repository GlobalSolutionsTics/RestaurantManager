import { OrdersDishesStatus } from "@/enums/orders.enum";
import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, runTransaction } from "firebase/database";
import type { AddDishesRequest } from "../../types/Order/order.type";

export const addNewItem = async (
  orderId: string,
  modifications: AddDishesRequest["modifications"],
) => {
  await signInAnonymously(getAuth());
  const { fullDate } = getActualDateDB();
  const orderRef = ref(
    realtimeDB,
    `${RT_ORDER_TABLE_NAME}/${fullDate}/${orderId}`,
  );
  const { submissionId } = modifications;
  const newDishes = modifications.dishesDescription.map((dish) => ({
    ...dish,
    status: OrdersDishesStatus.ACTIVE,
  }));
  const timestamp = new Date().toString();

  const result = await runTransaction(
    orderRef,
    (
      order:
        | (TResponseOrders & { dishAdditionIds?: Record<string, true> })
        | null,
    ) => {
      if (
        !order ||
        order.uuid !== orderId ||
        order.dishAdditionIds?.[submissionId] ||
        order.status === StatusEnum.CLOSED ||
        order.status === StatusEnum.CANCELED
      )
        return order;

      const dishesDescription = (order.dishesDescription ?? []).concat(
        newDishes.map((dish) => ({ ...dish, number: dish.number ?? 0 })),
      );
      return {
        ...order,
        dishesDescription,
        dishes: dishesDescription.reduce(
          (total, dish) => total + (Number(dish.number) || 0),
          0,
        ),
        dishAdditionIds: { ...order.dishAdditionIds, [submissionId]: true },
        status: StatusEnum.EDITED,
        updateAt: timestamp,
      };
    },
    { applyLocally: false },
  );

  if (!result.committed) throw new Error("La transacción no se confirmó");
  return result.snapshot.child("dishAdditionIds").child(submissionId).exists();
};
