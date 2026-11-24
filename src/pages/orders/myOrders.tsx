import OrderDishSummary from "@/components/orders/OrderDishSummary";
import WaiterOrderLayout, {
  OrderStatus,
  orderPanel,
  orderPrimaryButton,
  orderSecondaryButton,
  orderTableLabel,
} from "@/components/orders/WaiterOrderLayout";
import { StatusEnum } from "@/enums/states.enum";
import type { RootRedux } from "@/store/store";
import type { TResponseOrders } from "@/types/menu.types";
import { getActualDateDB } from "@/utils/formats";
import { isDishSent } from "@/utils/kitchenOrder";
import { CHECKS } from "@/utils/users";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  AddRounded,
  CheckCircleOutline,
  Checklist,
  EditOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyOrdersPage() {
  const router = useRouter();
  const { type, uuid } = useSelector((state: RootRedux) => state.user);
  const waiter = type === CHECKS ? uuid : "";
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    waiter: string;
    attempt: number;
    orders: TResponseOrders[] | null;
  }>();
  const loaded =
    result?.waiter === waiter && result.attempt === attempt
      ? result
      : undefined;
  const active =
    loaded?.orders?.filter(
      (order) => order.status !== StatusEnum.ORDER_READY,
    ) ?? [];
  const ready =
    loaded?.orders?.filter(
      (order) => order.status === StatusEnum.ORDER_READY,
    ) ?? [];
  const showReady = router.query.vista === "listas";
  const visible = showReady ? ready : active;

  useEffect(() => {
    if (!waiter) return;
    let subscribed = true;
    let unsubscribe: Unsubscribe | undefined;
    const fail = () => {
      if (subscribed) setResult({ waiter, attempt, orders: null });
    };
    const connect = async () => {
      await signInAnonymously(getAuth());
      if (!subscribed) return;
      const { fullDate } = getActualDateDB();
      unsubscribe = onValue(
        ref(realtimeDB, `${RT_ORDER_TABLE_NAME}/${fullDate}`),
        (snapshot) => {
          if (!subscribed) return;
          const data: Record<string, TResponseOrders & { orderId?: number }> =
            snapshot.val() ?? {};
          const orders = Object.values(data)
            .filter(
              (order) =>
                order.waiter === waiter &&
                [
                  StatusEnum.SEND,
                  StatusEnum.IN_PROGRESS,
                  StatusEnum.EDITED,
                  StatusEnum.ORDER_READY,
                ].some((status) => status === order.status),
            )
            .sort((a, b) => (a.orderId ?? 0) - (b.orderId ?? 0));
          setResult({ waiter, attempt, orders });
        },
        fail,
      );
    };
    void connect().catch(fail);
    return () => {
      subscribed = false;
      unsubscribe?.();
    };
  }, [waiter, attempt]);

  return (
    <WaiterOrderLayout
      title='Mis órdenes'
      backHref='/orders/create'
      backLabel='Inicio'
    >
      <nav
        aria-label='Estado de las órdenes'
        className={`${orderPanel} flex flex-wrap gap-2`}
      >
        <Link
          href='/orders/myOrders'
          replace
          shallow
          aria-current={!showReady ? "page" : undefined}
          className={!showReady ? orderPrimaryButton : orderSecondaryButton}
        >
          <Checklist fontSize='small' /> Activas ({active.length})
        </Link>
        <Link
          href='/orders/myOrders?vista=listas'
          replace
          shallow
          aria-current={showReady ? "page" : undefined}
          className={showReady ? orderPrimaryButton : orderSecondaryButton}
        >
          <CheckCircleOutline fontSize='small' /> Listas ({ready.length})
        </Link>
      </nav>
      {!loaded && (
        <p className={orderPanel} role='status'>
          Cargando órdenes…
        </p>
      )}
      {loaded?.orders === null && (
        <div
          className={`${orderPanel} flex flex-wrap items-center justify-between gap-2`}
          role='alert'
        >
          <p>No se pudieron cargar las órdenes.</p>
          <button
            type='button'
            className={orderSecondaryButton}
            onClick={() => setAttempt((current) => current + 1)}
          >
            Reintentar
          </button>
        </div>
      )}
      {loaded?.orders && !visible.length && (
        <p className={orderPanel}>
          No tienes órdenes {showReady ? "listas" : "activas"}.
        </p>
      )}
      <div className='grid items-start gap-4 sm:grid-cols-2'>
        {visible.map((order) => (
          <article key={order.uuid} className={`${orderPanel} space-y-4`}>
            <header className='flex flex-wrap items-center justify-between gap-2'>
              <h2 className='text-lg font-semibold'>
                {orderTableLabel(order)}
              </h2>
              <OrderStatus status={order.status} />
            </header>
            <OrderDishSummary dishes={order.dishesDescription} />
            <div className='flex flex-wrap gap-2 border-t border-slate-200 pt-3'>
              <Link
                href={`/orders/add/${order.uuid}`}
                className={orderSecondaryButton}
              >
                <AddRounded fontSize='small' /> Añadir
              </Link>
              {order.dishesDescription?.some((dish) =>
                isDishSent(dish.status),
              ) && (
                <Link
                  href={`/orders/edit/${order.uuid}`}
                  className={orderSecondaryButton}
                >
                  <EditOutlined fontSize='small' /> Editar
                </Link>
              )}
              <Link
                href={`/orders/notes/${order.uuid}`}
                className={orderPrimaryButton}
              >
                <ReceiptLongOutlined fontSize='small' /> Cuenta
              </Link>
            </div>
          </article>
        ))}
      </div>
    </WaiterOrderLayout>
  );
}
