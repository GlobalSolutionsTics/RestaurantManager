import { listUserSerive } from "@/services/users";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import {
  currencyFormat,
  formatDate,
  formatDateTime,
  textToString,
} from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { Edit } from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PrintOrderPage = () => {
  const [information, setInformation] = useState<
    TResponseOrders & { creatAt: string }
  >();
  const [wainterName, setWainterName] = useState("");

  const [total, setTotal] = useState(0);
  const [subtotaly, setSubtotaly] = useState(0);
  const [iva, setIVA] = useState(0);

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
        setWainterName(wainter?.name);
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
          const select: TResponseOrders = data[id];
          const totaly = select?.dishesDescription.reduce(
            (prev, next) => prev + next.number * next.price,
            0,
          );
          const subTotal = totaly / 1.16;

          setInformation(data[id]);
          setTotal(totaly);
          setSubtotaly(subTotal);
          setIVA(totaly - subTotal);
        }
      });
    }
  }, [query]);
  useEffect(() => {
    getWinterInformation();
    init();
  }, [query, information?.waiter]);

  if (information === undefined) {
    return <>Cargando</>;
  }

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
            width={100}
            height={100}
            alt='Image logo'
          />
        </div>
        <p className='font-primary font-bold text-center mb-2 print-title'>
          MARIS QUERIDA
        </p>
        <p className='font-secondary mb-2 mb-2 text-center print-text'>
          Valle del vístula esquina Valle de Oaxaca. Valle de Aragon 2da Secc,
          57100 Nezahualcóyotl, Méx., Mexico City, Mexico
        </p>
        <hr className='my-2' />
        <table className='w-full'>
          <tr>
            <td className='print-text-small'>Fecha y hora de entrada:</td>
            <td className='print-text-small text-right'>
              {formatDateTime(information?.creatAt || "")}
            </td>
          </tr>
          <tr>
            <td className='print-text-small'>Mesero:</td>
            <td className='print-text-small text-right'>{wainterName}</td>
          </tr>
          <tr>
            <td className='print-text-small'>Mesa:</td>
            <td className='print-text-small text-right'>
              {information?.tableNumber === DEFAULT_TABLE_LLEVAR
                ? "PARA LLEVAR"
                : "MESA " + information.tableNumber}
            </td>
          </tr>
        </table>
        <hr className='my-2' />
        <table className='w-full'>
          <thead>
            <tr>
              <td className='font-bold print-text'>Cant.</td>
              <td className='font-bold print-text'>Descripción</td>
              <td className='font-bold print-text'>Importe</td>
              <td className='font-bold no-print'>Acciones</td>
            </tr>
          </thead>
          <tbody>
            {information?.dishesDescription !== undefined ? (
              information?.dishesDescription.map((itm) => (
                <tr
                  className={`font-secondary print-text ${
                    itm.number === 0 ? "no-print" : ""
                  }} `}
                >
                  <td className={itm.number === 0 ? "no-print" : ""}>
                    {itm.number}
                  </td>
                  <td className={itm.number === 0 ? "no-print" : ""}>
                    {itm.name}
                  </td>
                  <td className={itm.number === 0 ? "no-print" : ""}>
                    {currencyFormat(itm.price * itm.number)}
                  </td>
                  <td className='no-print'>
                    <Edit />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
        <hr className='my-2' />
        <table className='w-full'>
          <tr>
            <td className='print-text-small'>SUBTOTAL:</td>
            <td className='print-text-small text-right'>
              {currencyFormat(subtotaly || 0)}
            </td>
          </tr>
          <tr>
            <td className='print-text-small'>IVA:</td>
            <td className='print-text-small text-right'>
              {currencyFormat(iva || 0)}
            </td>
          </tr>
          <tr>
            <td className='print-text-small'>TOTAL:</td>
            <td className='print-text-small text-right'>
              {currencyFormat(total || 0)}
            </td>
          </tr>
        </table>
        <div className='font-secondary text-[1.25rem] w-full mt-4 print-text'>
          {textToString(total)} pesos
        </div>
      </div>
    </>
  );
};

export default PrintOrderPage;
