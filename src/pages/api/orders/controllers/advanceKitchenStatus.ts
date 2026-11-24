import { StatusApplicationEnum, StatusEnum } from "@/enums/states.enum";
import type { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import {
  advanceKitchenOrder,
  getKitchenOrderAction,
  type KitchenOrderAction,
} from "@/utils/kitchenOrder";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, runTransaction } from "firebase/database";
import { changeStatusRequestEditionForOrderId } from "./updateOrder";

export async function advanceKitchenStatus(
  orderId: string,
  kitchenType?: string,
  expectedStatus?: string,
  expectedAction?: KitchenOrderAction,
) {
  await signInAnonymously(getAuth());
  const orderRef = ref(
    realtimeDB,
    `${RT_ORDER_TABLE_NAME}/${getActualDateDB().fullDate}/${orderId}`,
  );
  let changed = false;
  const result = await runTransaction(
    orderRef,
    (order: TResponseOrders | null) => {
      changed = false;
      if (
        order?.uuid !== orderId ||
        (expectedStatus && order.status !== expectedStatus) ||
        (expectedAction &&
          getKitchenOrderAction(order, kitchenType) !== expectedAction)
      )
        return order;

      const next = advanceKitchenOrder(order, kitchenType);
      changed = next !== order;
      return next;
    },
    { applyLocally: false },
  );

  if (!result.committed) throw new Error("La transacción no se confirmó");
  if (result.snapshot.child("uuid").val() !== orderId) return "missing";
  if (!changed) return "conflict";
  if (result.snapshot.child("status").val() === StatusEnum.ORDER_READY) {
    try {
      await changeStatusRequestEditionForOrderId(
        StatusApplicationEnum.CLOSE,
        orderId,
      );
    } catch (error) {
      console.error("No se pudo cerrar la solicitud de edición:", error);
    }
  }
  return "saved";
}
