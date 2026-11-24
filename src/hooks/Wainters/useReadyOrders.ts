import { StatusEnum } from "@/enums/states.enum";
import type { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { useEffect, useState } from "react";

export function useReadyOrders(waiterId: string) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    waiterId: string;
    attempt: number;
    orders: TResponseOrders[];
    error: boolean;
  }>();

  useEffect(() => {
    if (!waiterId) return;

    let active = true;
    let unsubscribe: Unsubscribe | undefined;
    const showError = () => {
      if (active) setResult({ waiterId, attempt, orders: [], error: true });
    };
    const subscribe = async () => {
      await signInAnonymously(getAuth());
      if (!active) return;

      const { fullDate } = getActualDateDB();
      unsubscribe = onValue(
        ref(realtimeDB, `${RT_ORDER_TABLE_NAME}/${fullDate}`),
        (snapshot) => {
          const orders: Record<string, TResponseOrders & { orderId?: number }> =
            snapshot.val() ?? {};
          if (!active) return;
          setResult({
            waiterId,
            attempt,
            error: false,
            orders: Object.values(orders)
              .filter(
                (order) =>
                  order.waiter === waiterId &&
                  order.status === StatusEnum.ORDER_READY,
              )
              .sort(
                (first, second) => (first.orderId ?? 0) - (second.orderId ?? 0),
              ),
          });
        },
        showError,
      );
    };

    void subscribe().catch(showError);
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [waiterId, attempt]);

  const current =
    result?.waiterId === waiterId && result.attempt === attempt
      ? result
      : undefined;
  return {
    orders: current?.orders ?? [],
    loading: !current,
    error: current?.error ?? false,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
