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
import { onValue, ref } from "firebase/database";
import { TResponseOrders } from "@/types/menu.types";
import { useRouter } from "next/router";
import ProtectPage from "../admin/components/protectPage";
import { StatusEnum } from "@/enums/states.enum";
import Head from "next/head";
import { updateOrderService } from "@/services/order";
import { TOKEN_ID } from "@/utils/strings";
import { Button } from "@mui/material";
import { getActualDateDB } from "@/utils/formats";
import { KITCHEN } from "@/utils/users";
import { OrderKitchen } from "@/components/OrderKitchen";

import { OrdersStatusEnum } from "@/components/OrderKitchen/type";

const HomeOrderPage = () => {
  const [orderView, setOrderView] = useState<OrdersStatusEnum>(
    OrdersStatusEnum.ACTIVE,
  );
  const [orders, setOrders] = useState<Array<TResponseOrders>>([]);
  const [ordersActived, setOrdersActived] = useState<Array<TResponseOrders>>(
    [],
  );
  const [ordersClose, setOrdersClose] = useState<Array<TResponseOrders>>([]);
  const [ordersReady, setOrdersReady] = useState<Array<TResponseOrders>>([]);

  //router controller
  const router = useRouter();

  //Fullscreen controller
  const handleFullscreen = useFullScreenHandle();

  const autheticate = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const date = getActualDateDB();
    const DB_RT =
      RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
    const connection = ref(realtimeDB, DB_RT);
    return onValue(connection, (snapshot) => {
      const data: Array<TResponseOrders> = snapshot.val();
      if (snapshot.exists()) {
        const elements = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId,
        );
        const ordersActived = elements.filter(
          (itm) =>
            itm.status !== StatusEnum.CLOSED &&
            itm.status !== StatusEnum.ORDER_READY &&
            itm.status !== StatusEnum.CANCELED,
        );
        const ordersClose = elements.filter(
          (itm) =>
            itm.status === StatusEnum.CLOSED ||
            itm.status === StatusEnum.CANCELED,
        );
        const ordersReady = elements.filter(
          (itm) => itm.status === StatusEnum.ORDER_READY,
        );

        setOrders(ordersActived);
        setOrdersClose(ordersClose);
        setOrdersReady(ordersReady);
        setOrdersActived(ordersActived);
      }
    });
  }, []);

  //Handle functions
  const sentFullscreen = async () => {
    await handleFullscreen.enter();
  };

  const handleChangeView = (status: OrdersStatusEnum) => {
    if (status === OrdersStatusEnum.ACTIVE) {
      setOrders(ordersActived);
    } else if (status === OrdersStatusEnum.READY) {
      setOrders(ordersReady);
    } else {
      setOrders(ordersClose);
    }
    setOrderView(status);
  };

  const handleClose = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    sessionStorage.removeItem(TOKEN_ID);
    router.push("/admin");
  }, []);

  const hanndleStartPetition = async (order: TResponseOrders) => {
    let nextStatus = null;
    if (order.status === StatusEnum.SEND) {
      nextStatus = StatusEnum.IN_PROGRESS;
    } else if (order.status === StatusEnum.IN_PROGRESS) {
      nextStatus = StatusEnum.ORDER_READY;
    } else if (order.status === StatusEnum.EDITED) {
      nextStatus = StatusEnum.IN_PROGRESS;
    }

    //Send a next status
    if (nextStatus !== null) {
      const token = sessionStorage.getItem(TOKEN_ID);
      if (token) {
        const update = await updateOrderService(token, order.uuid, nextStatus);
        if (!update) {
          console.error("Error al hacer el update");
        }
      }
    }
  };

  useEffect(() => {
    autheticate();
  }, []);

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
                onClick={() => handleChangeView(OrdersStatusEnum.ACTIVE)}
              >
                <Checklist /> Activas ({ordersActived.length})
              </Button>
              <Button
                className={
                  orderView === OrdersStatusEnum.READY
                    ? "!bg-blue-light !text-blue-dark"
                    : "!text-white"
                }
                onClick={() => handleChangeView(OrdersStatusEnum.READY)}
              >
                <Check /> Listas ({ordersReady.length})
              </Button>
              <Button
                className={
                  orderView === OrdersStatusEnum.CLOSE
                    ? "!bg-blue-light !text-blue-dark"
                    : "!text-white"
                }
                onClick={() => handleChangeView(OrdersStatusEnum.CLOSE)}
              >
                <Close /> Cerradas ({ordersClose.length})
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
            {orders.length > 0 &&
              orders.map((itm) => (
                <OrderKitchen
                  key={itm.uuid}
                  itm={itm}
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
