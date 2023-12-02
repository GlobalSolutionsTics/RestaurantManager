import { useCallback, useEffect, useMemo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  CheckCircle,
  Checklist,
  CloseOutlined,
  OpenInFull,
  PowerOff,
  PowerSettingsNew,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import { TResponseOrders } from "@/types/menu.types";
import { useRouter } from "next/router";

const HomeOrderPage = () => {
  const [orders, setOrders] = useState<Array<TResponseOrders>>([]);
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

  console.log("Orders:", orders);

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

  //Carga inicial
  useEffect(() => {
    autheticate();
  }, []);
  return (
    <FullScreen handle={handleFullscreen}>
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
                <div className='bg-success-dark text-[1.5rem] font-primary text-white w-full rounded-t-lg p-4'>
                  <CheckCircle /> Mesa {itm.tableNumber}
                </div>
                <div className='h-[calc(400px_-_3rem)] bg-white rounded-b-lg flex flex-col flex-start'>
                  {itm.dishesDescription.map((dish) => (
                    <div
                      key={dish.uuid}
                      className='w-full py-2 px-4 flex flex-row'
                    >
                      <div className='basis-3/4 font-secondary'>
                        {dish.name}
                      </div>
                      <div className='basis-1/4 font-secondary'>
                        {dish.number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </FullScreen>
  );
};

export default HomeOrderPage;
