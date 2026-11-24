import { useEffect, useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { get, ref } from "firebase/database";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import type { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";

export function useOrderForEditing(orderId: string) {
  const [result, setResult] = useState<{
    id: string;
    order: TResponseOrders | null;
  }>();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        await signInAnonymously(getAuth());
        if (!active) return;
        const { fullDate } = getActualDateDB();
        const snapshot = await get(
          ref(realtimeDB, `${RT_ORDER_TABLE_NAME}/${fullDate}/${orderId}`),
        );
        const order: TResponseOrders | null = snapshot.val();
        if (active)
          setResult({
            id: orderId,
            order: order?.uuid === orderId ? order : null,
          });
      } catch {
        if (active) setResult({ id: orderId, order: null });
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [orderId]);

  return result?.id === orderId ? result.order : undefined;
}
