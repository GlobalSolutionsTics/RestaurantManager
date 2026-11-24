import { realtimeDB } from "@firebase/config";
import { ref, runTransaction } from "firebase/database";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { StatusEnum } from "@/enums/states.enum";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import type { TOrder } from "../../types/Order/order.type";

type NewOrder = Pick<
  TOrder,
  "name" | "dishes" | "tableNumber" | "dishesDescription" | "waiter"
> &
  Partial<Pick<TOrder, "diners">>;

const addOrder = async (
  order: NewOrder,
  uuid: string,
  date: string,
  canCreate: boolean,
) => {
  await signInAnonymously(getAuth());
  const ordersRef = ref(realtimeDB, `${RT_ORDER_TABLE_NAME}/${date}`);
  const timestamp = new Date().toString();

  const result = await runTransaction(
    ordersRef,
    (orders: Record<string, TOrder> | null) => {
      // Returning the current value lets Firebase verify it even on a cold cache.
      if (!canCreate || orders?.[uuid]) return orders;

      let lastOrderId = 0;
      for (const existing of Object.values(orders ?? {})) {
        if (
          order.tableNumber !== DEFAULT_TABLE_LLEVAR &&
          existing.tableNumber === order.tableNumber &&
          existing.status !== StatusEnum.CLOSED &&
          existing.status !== StatusEnum.CANCELED
        ) {
          return orders;
        }
        lastOrderId = Math.max(lastOrderId, Number(existing.orderId) || 0);
      }

      return {
        ...orders,
        [uuid]: {
          ...order,
          orderId: lastOrderId + 1,
          uuid,
          status: StatusEnum.SEND,
          version: 2,
          creatAt: timestamp,
          updateAt: timestamp,
        },
      };
    },
    { applyLocally: false },
  );

  if (!result.committed) throw new Error("La transacción no se confirmó");
  return result.snapshot.child(uuid).exists();
};

export default addOrder;
