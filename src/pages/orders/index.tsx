import { useCallback, useEffect, useMemo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  CheckCircle,
  Checklist,
  CloseOutlined,
  HourglassFull,
  KeyboardArrowRight,
  Notifications,
  OpenInFull,
  PowerOff,
  PowerSettingsNew,
  Timer,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { TResponseOrders } from "@/types/menu.types";
import { useRouter } from "next/router";
import ProtectPage from "../admin/components/protectPage";
import { StatusEnum } from "@/enums/states.enum";

const HomeOrderPage = () => {
  const [orders, setOrders] = useState<Array<TResponseOrders>>([]);
  const [uuidSelect, setUUIDSelect] = useState("");

  const [orderDetail, setOrderDetail] = useState<Array<any> | null>(null);
  const [orderSelected, setOrderSelected] = useState<any>({});
  const [uuidSelected, setUUIDSelected] = useState("");
  const [numberTable, setNumberTable] = useState("");

  //router controller
  const router = useRouter();

  //Fullscreen controller
  const handleFullscreen = useFullScreenHandle();

  const autheticate = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      const data: Array<TResponseOrders> = snapshot.val();
      if (snapshot.exists()) {
        const elements = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId,
        );
        setOrders(elements);
      }
    });
  }, []);

  //Handle functions
  const sentFullscreen = async () => {
    await handleFullscreen.enter();
  };

  const handleClose = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    sessionStorage.removeItem("rest-token");
    router.push("/admin");
  }, []);

  const hanndleStartPetition = async (uuid: string) => {
    setUUIDSelect(uuid);
  };

  //Color controller
  const getColorForHeader = (uuid: string, status: string) => {
    if (uuid === uuidSelect && status === StatusEnum.SEND) {
      return "bg-waiting-dark text-dark";
    }

    return "bg-danger-dark text-white";
  };

  const getColorButton = (uuid: string, status: string) => {
    if (uuid === uuidSelect && status === StatusEnum.SEND) {
      return "bg-waiting-dark hover:bg-waiting-dark hover:text-dark";
    }

    return "bg-success hover:bg-success-dark hover:text-white";
  };

  //Icon and text controller
  const getIconHeader = (uuid: string, status: string) => {
    if (uuid === uuidSelect && status === StatusEnum.SEND) {
      return <HourglassFull className='animate-spin' />;
    }

    return <Timer className='animate-pulse' />;
  };

  const getIconButton = (uuid: string, status: string) => {
    if (uuid === uuidSelect && status === StatusEnum.SEND) {
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
  return (
    <FullScreen handle={handleFullscreen}>
      <ProtectPage push={router.push}>
        <div className='flex flex-col flex-start w-full h-[100vh]'>
          <div className='flex flex-row justify-between w-full bg-blue-dark h-[3.5rem]'>
            <div className='text-white p-4 text-[1rem] font-primary'>
              <Checklist /> Comandas activas ({orders.length})
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
          <div className='bg-black h-autp min-h-[calc(100vh_-_3.5rem)] p-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-5 lg:gap-5 overflow-y-auto overflow-x-hidden'>
            {orders.length > 0 &&
              orders.map((itm) => (
                <div key={itm.uuid} className='min-h-[400px] rounded-lg mb-4'>
                  <div
                    className={`transition ease-in-out delay-150 ${getColorForHeader(
                      itm.uuid,
                      itm.status,
                    )} text-[1.5rem] font-primary w-full rounded-t-lg p-4`}
                  >
                    {getIconHeader(itm.uuid, itm.status)} Mesa {itm.tableNumber}
                    <p className='font-primary text-[1rem]'>
                      Estatus:{" "}
                      {itm.status === StatusEnum.SEND
                        ? "PENDIENTE"
                        : itm.status}
                    </p>
                  </div>
                  <div className='h-[calc(400px_-_3rem)] bg-enabled rounded-b-lg flex flex-col flex-start justify-between'>
                    <div>
                      <div className='w-full py-2 px-4 flex flex-row'>
                        <div className='basis-5/6 font-bold font-secondary'>
                          Descripción
                        </div>
                        <div className='basis-1/6 font-bold text-center font-secondary'>
                          Cant.
                        </div>
                      </div>
                      {itm.dishesDescription.map((dish) => (
                        <div
                          key={dish.uuid}
                          className='w-full py-2 px-4 flex flex-row'
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
                    <div className='p-4 w-full'>
                      <button
                        onClick={() => hanndleStartPetition(itm.uuid)}
                        className={`p-2 w-full rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
                          itm.uuid,
                          itm.status,
                        )} disabled:bg-gray`}
                        disabled={itm.uuid !== uuidSelect && uuidSelect !== ""}
                      >
                        {getIconButton(itm.uuid, itm.status)}
                      </button>
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
