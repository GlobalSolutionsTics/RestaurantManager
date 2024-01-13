import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { currencyFormat } from "@/utils/formats";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  CheckCircle,
  HourglassFullRounded,
  RamenDining,
  RoomService,
  Send,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const CheckPages = () => {
  const [orderDetail, setOrderDetail] = useState<TResponseOrders>({
    name: "",
    status: "",
    dishes: 0,
    dishesDescription: [],
    uuid: "",
    tableNumber: 0,
  });

  const [colorsTheme, setColorsTheme] = useState({
    colorPreparing: "text-dark",
    colorWaiting: "text-dark",
    colorReady: "text-dark",
    colorTitle: "text-dark",
  });

  const router = useRouter();

  //Handlers
  const getTitle = () => {
    switch (orderDetail?.status) {
      case StatusEnum.SEND:
        return "Tu pedido se ha enviado";
      case StatusEnum.IN_PROGRESS:
        return "El chef está preparando tu pedido";
      case StatusEnum.ORDER_READY:
        return "Que lo disfrutes, tu orden está lista";
      default:
        return "Tu orden a sido creada exitosamente";
    }
  };

  //Icons and animation controller
  const getIconStatus = () => {
    switch (orderDetail.status) {
      case StatusEnum.SEND:
      case StatusEnum.IN_PROGRESS:
        return (
          <HourglassFullRounded fontSize='small' className='animate-spin' />
        );
      case StatusEnum.ORDER_READY:
        return <CheckCircle fontSize='small' />;
      default:
        return "";
    }
  };

  const changeColorForStatus = (status: string) => {
    switch (status) {
      case StatusEnum.SEND:
        setColorsTheme({ ...colorsTheme, colorPreparing: "text-success-dark" });
        break;
      case StatusEnum.IN_PROGRESS:
        setColorsTheme({
          ...colorsTheme,
          colorPreparing: "text-success-dark",
          colorWaiting: "text-waiting-dark",
        });
        break;
      case StatusEnum.ORDER_READY:
        setColorsTheme({
          ...colorsTheme,
          colorPreparing: "text-success-dark",
          colorWaiting: "text-success-dark",
          colorTitle: "text-success-dark",
          colorReady: "text-success-dark",
        });
        break;
      default:
        return "";
    }
  };

  //Carga inicial

  const getOrders = useCallback(async () => {
    const paramId = router.query.id;
    const auth = getAuth();
    await signInAnonymously(auth);
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + paramId);
    return onValue(connection, (snapshot) => {
      if (snapshot.exists()) {
        const data: TResponseOrders = snapshot.val();
        setOrderDetail(data);
        changeColorForStatus(data.status);
      }
    });
  }, [router.query.id]);

  useEffect(() => {
    getOrders();
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Progreso de mi orden</title>
      </Head>
      <nav className='navbar'>
        <Image
          className='logo'
          src='/logo_sin_fondo.png'
          alt='Logo marisquerida'
          width={96}
          height={96}
        />
      </nav>
      <div
        itemScope
        className='wood-font mid flex min-h-[calc(100vh_-_96px)] w-full px-4'
      >
        <div className='bg-white rounded-lg w-full md:w-[80%] lg:w-[70%] p-4 mt-[6rem]'>
          <div className='flex flex-row justify-between w-full mb-8'>
            <div
              className={`flex flex-col basis-1/3 items-center transition ease-in-out delay-150 duration-300 ${colorsTheme.colorPreparing}`}
            >
              <Send fontSize='large' />
              <span className='text-[0.5rem] mt-2'>Orden enviada</span>
            </div>
            <div
              className={`flex flex-col basis-1/3 items-center transition ease-in-out delay-150 duration-300 ${colorsTheme.colorWaiting}`}
            >
              <RamenDining fontSize='large' />
              <span className='text-[0.5rem] mt-2'>Cocinando orden</span>
            </div>
            <div
              className={`flex flex-col basis-1/3 items-center transition ease-in-out delay-150 duration-300 ${colorsTheme.colorReady}`}
            >
              <RoomService fontSize='large' />
              <span className='text-[0.5rem] mt-2'>Orden lista</span>
            </div>
          </div>
          <p
            className={`transition ease-in-out delay-150 duration-300 text-center font-primary text-[1.25rem] md:text-[2rem] lg:text-[2.5rem] text-bold ${colorsTheme.colorTitle}`}
          >
            {getIconStatus()} {getTitle()}
          </p>
          <p className='font-secondary text-[1.5rem] mt-4'>
            Detalle de la orden
          </p>
          <div className='flex flex-col'>
            <div className='flex flex-row text-[1.25rem] font-bold'>
              <div className='font-primary basis-4/6'>Platillo</div>
              <div className='font-primary basis-1/6 text-center'>Cant.</div>
              <div className='font-primary basis-1/6 text-center'>Cost.</div>
            </div>
            {orderDetail.dishesDescription.map((itm, idx) => (
              <div
                key={itm.uuid + "-" + idx}
                className='flex flex-row font-bold text-[1rem]'
              >
                <div className='font-primary basis-4/6'>{itm.name}</div>
                <div className='font-primary basis-1/6 text-center'>
                  {itm.number}
                </div>
                <div className='font-primary basis-1/6 text-center'>
                  {currencyFormat(itm.number * itm.price)}
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-row text-primary font-bold text-[1.5rem] mt-8'>
            <div className='basis-2/3 text-left'>Total:</div>
            <div className='basis-1/3  text-right'>
              {currencyFormat(
                orderDetail.dishesDescription.reduce(
                  (prev, dish) => prev + dish.number * dish.price,
                  0,
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckPages;
