import { StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const CheckPages = () => {
  const [orderDetail, setOrderDetail] = useState<TResponseOrders>();

  const router = useRouter();
  const paramId = router.query.id;

  //Handlers
  const getTitle = () => {
    switch (orderDetail?.status) {
      case StatusEnum.IN_PROGRESS:
        return "Tu pedido se ha enviado";
      case StatusEnum.SEND:
        return "El chef está preparando tu pedido";
      case StatusEnum.ORDER_READY:
        return "Preparate, tu orden está lista";
      default:
        return "Tu orden a sido creada exitosamente";
    }
  };

  //Carga inicial

  const getOrders = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME + "/" + paramId);
    return onValue(connection, (snapshot) => {
      if (snapshot.exists()) {
        const data: TResponseOrders = snapshot.val();
        setOrderDetail(data);
      }
    });
  }, []);

  useEffect(() => {
    getOrders();
  }, []);

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
        className='wood-font p-4 mid flex justify-center items-center min-h-[calc(100vh_-_96px)] w-full'
      >
        <div className='bg-white rounded-lg w-[70%]'>
          <p className='text-center font-primary text-[3rem] text-bold'>
            {getTitle()}
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckPages;
