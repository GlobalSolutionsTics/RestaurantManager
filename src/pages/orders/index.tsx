import { useCallback, useEffect, useMemo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  Check,
  CheckCircle,
  Checklist,
  Close,
  HourglassFull,
  KeyboardArrowRight,
  Notifications,
  OpenInFull,
  PowerSettingsNew,
  Timer,
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
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { Button } from "@mui/material";
import { OrdersDishesStatus } from "@/enums/orders.enum";
import { getActualDateDB } from "@/utils/formats";
import { KITCHEN } from "@/utils/users";

enum OrdersStatusEnum {
  ACTIVE = "ACTIVAS",
  READY = "LISTAS",
  CLOSE = "CERRADAS",
}

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
  const [loading, setLoading] = useState(false);

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
            itm.status !== StatusEnum.ORDER_READY,
        );
        const ordersClose = elements.filter(
          (itm) => itm.status === StatusEnum.CLOSED,
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
        setLoading(true);
        const update = await updateOrderService(token, order.uuid, nextStatus);
        if (!update) {
          console.error("Error al hacer el update");
        }
        setLoading(false);
      }
    }
  };

  //Color controller
  const getColorForHeader = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark text-dark";
    } else if (status === StatusEnum.ORDER_READY) {
      return "bg-success-dark text-white";
    } else if (status === StatusEnum.EDITED) {
      return "bg-orange-dark text-dark";
    }

    return "bg-danger-dark text-white";
  };

  const getColorButton = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark hover:bg-waiting-dark hover:text-dark";
    } else if (
      status === StatusEnum.ORDER_READY ||
      status === StatusEnum.CLOSED
    ) {
      return "bg-success-dark text-white hidden";
    } else if (status === StatusEnum.EDITED) {
      return "bg-orange-dark hover:bg-orange hover:text-dark";
    }

    return "bg-danger hover:bg-danger-dark text-white";
  };

  //Icon and text controller
  const getIconHeader = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return <HourglassFull className='animate-spin' />;
    } else if (status === StatusEnum.ORDER_READY) {
      return <CheckCircle />;
    }

    return <Timer className='animate-pulse' />;
  };

  const getIconButton = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return (
        <>
          <Notifications /> Terminar Orden
        </>
      );
    }

    return (
      <>
        <KeyboardArrowRight /> Iniciar Orden
      </>
    );
  };

  //Carga inicial
  useEffect(() => {
    autheticate();
  }, []);

  const token = sessionStorage.getItem(TOKEN_ID);
  return (
    <FullScreen handle={handleFullscreen}>
      <ProtectPage push={router.push} requiredProfiles={KITCHEN} token={token}>
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
                <div key={itm.uuid} className='rounded-lg mb-4'>
                  <div
                    className={`transition ease-in-out delay-150 ${getColorForHeader(
                      itm.status,
                    )} text-[1.5rem] font-secondary w-full rounded-t-lg p-4`}
                  >
                    {getIconHeader(itm.status)}{" "}
                    {itm.tableNumber === DEFAULT_TABLE_LLEVAR
                      ? "Para llevar"
                      : "Mesa " + itm.tableNumber}
                    <p className='font-secondary text-[1rem]'>
                      Estatus:{" "}
                      {itm.status === StatusEnum.SEND
                        ? "PENDIENTE"
                        : itm.status}
                    </p>
                  </div>
                  <div className='bg-enabled rounded-b-lg flex flex-col flex-start justify-between'>
                    <div className=''>
                      <div className='w-full py-2 px-4 flex flex-row'>
                        <div className='basis-5/6 font-bold text-[1.5rem] font-secondary'>
                          Descripción
                        </div>
                        <div className='basis-1/6 font-bold text-[1.5rem] text-center font-secondary'>
                          Cant.
                        </div>
                      </div>
                      {orderView === OrdersStatusEnum.ACTIVE &&
                        itm.dishesDescription
                          ?.filter(
                            (itm: any) =>
                              itm.status === OrdersDishesStatus.ACTIVE,
                          )
                          .map((dish, indx) => (
                            <div
                              key={dish.uuid + "-" + indx}
                              className='w-full py-2 px-4 text-[1.5rem] flex flex-row'
                            >
                              <div className='basis-5/6 font-secondary'>
                                {dish.name}
                              </div>
                              <div className='basis-1/6 text-center font-secondary'>
                                {dish.number}
                              </div>
                            </div>
                          ))}
                      {orderView !== OrdersStatusEnum.ACTIVE &&
                        itm.dishesDescription?.map((dish, indx) => (
                          <div
                            key={dish.uuid + "-" + indx}
                            className='w-full py-2 px-4 text-[1.5rem] flex flex-row'
                          >
                            <div className='basis-5/6 font-secondary'>
                              {dish.name}
                            </div>
                            <div className='basis-1/6 text-center font-secondary'>
                              {dish.number}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className='p-1 bottom-1 w-full'>
                      {loading ? (
                        <div className='flex items-center'>
                          <span className='loader mr-4'></span> Guardando
                          información
                        </div>
                      ) : (
                        <button
                          onClick={() => hanndleStartPetition(itm)}
                          className={`p-2 w-full bottom-0 rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
                            itm.status,
                          )} disabled:bg-gray`}
                        >
                          {getIconButton(itm.status)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </ProtectPage>
    </FullScreen>
  );
};

export default HomeOrderPage;
