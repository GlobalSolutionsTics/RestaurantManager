import { useCallback, useEffect, useMemo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  Check,
  Checklist,
  Close,
  OpenInFull,
  PowerSettingsNew,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { TResponseOrders } from "@/types/menu.types";
import { useRouter } from "next/router";
import ProtectPage from "../admin/components/protectPage";
import { StatusEnum } from "@/enums/states.enum";
import Head from "next/head";
import { advanceKitchenOrderService } from "@/services/order";
import { TOKEN_ID } from "@/utils/strings";
import { Button } from "@mui/material";
import { getActualDateDB } from "@/utils/formats";
import {
  belongsToKitchen,
  getKitchenIdentity,
  type KitchenOrderAction,
} from "@/utils/kitchenOrder";
import type { RootRedux } from "@/store/store";
import { useSelector } from "react-redux";
import { KITCHEN } from "@/utils/users";
import { OrderKitchen } from "@/components/OrderKitchen";

import { OrdersStatusEnum } from "@/components/OrderKitchen/type";

const HomeOrderPage = () => {
  const [orderView, setOrderView] = useState<OrdersStatusEnum>(
    OrdersStatusEnum.ACTIVE,
  );
  const [orders, setOrders] = useState<
    Array<TResponseOrders & { orderId?: number }>
  >([]);
  const { type, kitchenType, uuid } = useSelector(
    (state: RootRedux) => state.user,
  );
  const kitchenIdentity = getKitchenIdentity(kitchenType, uuid);
  const router = useRouter();
  const handleFullscreen = useFullScreenHandle();

  const { active, ready, closed } = useMemo(() => {
    const active: TResponseOrders[] = [];
    const ready: TResponseOrders[] = [];
    const closed: TResponseOrders[] = [];
    for (const order of orders) {
      if (
        order.status === StatusEnum.CLOSED ||
        order.status === StatusEnum.CANCELED
      ) {
        closed.push(order);
      } else if (order.status === StatusEnum.ORDER_READY) {
        ready.push(order);
      } else if (
        type === KITCHEN &&
        order.dishesDescription?.some(
          (dish) =>
            Number(dish.number) > 0 && belongsToKitchen(dish, kitchenIdentity),
        )
      ) {
        active.push(order);
      }
    }
    return { active, ready, closed };
  }, [orders, type, kitchenIdentity]);
  const visibleOrders =
    orderView === OrdersStatusEnum.ACTIVE
      ? active
      : orderView === OrdersStatusEnum.READY
        ? ready
        : closed;

  const sentFullscreen = async () => {
    await handleFullscreen.enter();
  };

  const handleClose = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    sessionStorage.removeItem(TOKEN_ID);
    router.push("/admin");
  }, [router]);

  const hanndleStartPetition = async (
    order: TResponseOrders,
    action: KitchenOrderAction,
  ) => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) throw new Error("Inicia sesión para actualizar la comanda.");
    await advanceKitchenOrderService(token, order.uuid, order.status, action);
  };

  useEffect(() => {
    if (type !== KITCHEN) return;
    let disposed = false;
    let unsubscribe: Unsubscribe | undefined;

    const subscribe = async () => {
      await signInAnonymously(getAuth());
      if (disposed) return;
      const { fullDate } = getActualDateDB();
      const connection = ref(realtimeDB, `${RT_ORDER_TABLE_NAME}/${fullDate}`);
      unsubscribe = onValue(connection, (snapshot) => {
        const data: Record<string, TResponseOrders & { orderId?: number }> =
          snapshot.val() ?? {};
        setOrders(
          Object.values(data).sort(
            (a, b) => (a.orderId ?? 0) - (b.orderId ?? 0),
          ),
        );
      });
    };

    void subscribe().catch((error) =>
      console.error("No se pudieron cargar las comandas:", error),
    );
    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [type]);

  return (
    <FullScreen handle={handleFullscreen}>
      <ProtectPage push={router.push} requiredProfiles={KITCHEN}>
        <Head>
          <title>Comandas activas</title>
        </Head>
        <div className='flex flex-col flex-start w-full h-[100vh]'>
          <div className='flex flex-row justify-between w-full bg-blue-dark h-[3.5rem]'>
            <div className='flex flex-row'>
              <Button
                className={
                  orderView === OrdersStatusEnum.ACTIVE
                    ? "!bg-blue-light !text-blue-dark"
                    : "!text-white"
                }
                onClick={() => setOrderView(OrdersStatusEnum.ACTIVE)}
              >
                <Checklist /> Activas ({active.length})
              </Button>
              <Button
                className={
                  orderView === OrdersStatusEnum.READY
                    ? "!bg-blue-light !text-blue-dark"
                    : "!text-white"
                }
                onClick={() => setOrderView(OrdersStatusEnum.READY)}
              >
                <Check /> Listas ({ready.length})
              </Button>
              <Button
                className={
                  orderView === OrdersStatusEnum.CLOSE
                    ? "!bg-blue-light !text-blue-dark"
                    : "!text-white"
                }
                onClick={() => setOrderView(OrdersStatusEnum.CLOSE)}
              >
                <Close /> Cerradas ({closed.length})
              </Button>
            </div>
            <div className='text-white p-4'>
              <button className='hover:bg-blue mr-4' onClick={sentFullscreen}>
                <OpenInFull />
              </button>
              <button className='hover:bg-blue' onClick={handleClose}>
                <PowerSettingsNew />
              </button>
            </div>
          </div>
          <div className='bg-black h-auto min-h-[calc(100vh_-_3.5rem)] p-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 overflow-y-auto overflow-x-hidden'>
            {visibleOrders.map((itm) => (
              <OrderKitchen
                key={itm.uuid}
                itm={itm}
                kitchenType={kitchenIdentity}
                onClick={hanndleStartPetition}
              />
            ))}
          </div>
        </div>
      </ProtectPage>
    </FullScreen>
  );
};

export default HomeOrderPage;
