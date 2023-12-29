import { listUserSerive } from "@/services/users";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat, textToString } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PrintOrderPage = () => {
  const [information, setInformation] = useState<TResponseOrders>();
  const [wainterName, setWainterName] = useState("");

  const { query } = useRouter();
  //Print controller
  const componentRef = useRef(null);
  //Handle functions
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  //Initial charger
  const getWinterInformation = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token !== null) {
      const wainters = await listUserSerive(token);
      const findWaint = wainters.filter(
        (itm: any) => itm.uuid === information?.waiter,
      );
      if (findWaint) {
        const wainter = findWaint[0];
        setWainterName(wainter.name);
      }
    }
  }, [information?.waiter]);

  const init = useCallback(async () => {
    const id = query.id as string;
    if (id !== undefined) {
      const auth = getAuth();
      await signInAnonymously(auth);
      const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
      return onValue(connection, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setInformation(data[id]);
        }
      });
    }
  }, [query]);
  useEffect(() => {
    getWinterInformation();
    init();
  }, [query, information?.waiter]);

  return (
    <>
      <button
        onClick={handlePrint}
        className='bg-aqua text-white font-secondary p-2'
      >
        IMPRIMIR
      </button>
      <div ref={componentRef} className='mb-4 px-4'>
        <div className='flex items-center justify-center'>
          <Image
            src={"/logo_con_fondo.png"}
            width={200}
            height={200}
            alt='Image logo'
          />
        </div>
        <p className='font-primary font-bold text-center mb-2'>MARIS QUERIDA</p>
        <p className='font-secondary mb-2 mb-2'>
          Valle del vístula esquina Valle de Oaxaca. Valle de Aragon 2da Secc,
          57100 Nezahualcóyotl, Méx., Mexico City, Mexico
        </p>
        <p className='font-secondary text-center mb-2'>
          ATENDIO POR {wainterName}
        </p>
        <p className='font-secondary text-center mb-2'>COMPROBANTE DE PAGO</p>
        <div className='gird grid-cols-3 font-secondary gap-3 mb-2'>
          {information?.tableNumber === DEFAULT_TABLE_LLEVAR &&
            "Orden para llevar"}
          {information?.tableNumber !== DEFAULT_TABLE_LLEVAR && (
            <>Mesa {information?.tableNumber}</>
          )}
        </div>
        <div className='grid grid-cols-4 font-secondary gap-4'>
          <div className='font-bold'>Cant.</div>
          <div className='font-bold'>Desc.</div>
          <div className='font-bold'>Precio Unit.</div>
          <div className='font-bold'>Importe</div>
        </div>
        {information?.dishesDescription.map((itm) => (
          <div className='grid grid-cols-4 font-secondary gap-4'>
            <div>{itm.number}</div>
            <div>{itm.name}</div>
            <div>{currencyFormat(itm.price)}</div>
            <div>{currencyFormat(itm.price * itm.number)}</div>
          </div>
        ))}
        <div className='font-primary font-bold w-full mt-4'>
          TOTAL:{" "}
          {currencyFormat(
            information?.dishesDescription.reduce(
              (prev, next) => prev + next.number * next.price,
              0,
            ) || 0,
          )}
        </div>
        <div className='font-secondary text-[1.25rem] w-full mt-4'>
          {textToString(
            information?.dishesDescription.reduce(
              (prev, next) => prev + next.number * next.price,
              0,
            ) || 0,
          )}{" "}
          pesos
        </div>
      </div>
    </>
  );
};

export default PrintOrderPage;
