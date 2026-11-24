import DinersDivisionForm from "@/components/orders/DinersDivisionForm";
import { groupOrderDishes } from "@/utils/groupOrderDishes";
import ProtectPage from "@/pages/admin/components/protectPage";
import { listUserSerive } from "@/services/users";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import {
  currencyFormat,
  formatDateTime,
  getActualDateDB,
} from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS, TOKEN } from "@/utils/users";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { ArrowBack } from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";

const NotePage = () => {
  const [showDivision, setShowDivision] = useState(false);
  const [tableNumber, setTableNumber] = useState(0);
  const [information, setInformation] = useState<
    TResponseOrders & { creatAt: string }
  >();
  const [wainterName, setWainterName] = useState("");
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  //Router handle
  const router = useRouter();
  const { query } = useRouter();
  //URL QR
  const url = `${process.env.NEXT_PUBLIC_URL_SERVICES}checks/${query.id}`;
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

  const orderId = typeof query.id === "string" ? query.id : undefined;
  const diners = Number(information?.diners);
  const canSplitBill = Number.isSafeInteger(diners) && diners > 1;

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      await signInAnonymously(getAuth());
      if (!active) return;
      const { fullDate } = getActualDateDB();
      const connection = ref(
        realtimeDB,
        `${RT_ORDER_TABLE_NAME}/${fullDate}/${orderId}`,
      );
      unsubscribe = onValue(connection, (snapshot) => {
        const data: (TResponseOrders & { creatAt: string }) | null =
          snapshot.val();
        const getTotal =
          data?.dishesDescription?.reduce(
            (prev, next) => prev + next.number * next.price,
            0,
          ) ?? 0;
        setTotal(getTotal);
        setSubtotal(getTotal / 1.16);
        setInformation(data ?? undefined);
        setTableNumber(data?.tableNumber ?? 0);
      });
    };
    void init().catch((error) =>
      console.error("Error al consultar la cuenta:", error),
    );

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [orderId]);

  useEffect(() => {
    void getWinterInformation();
  }, [getWinterInformation]);

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <div className='font-primary text-[1.5rem] p-4 flex flex-row'>
        <div className='basis-1/5'>
          <button onClick={router.back}>
            <ArrowBack fontSize='large' />
          </button>
        </div>
        <div className='basis-4/5 flex items-center font-bold'>
          Nota{" "}
          {tableNumber === DEFAULT_TABLE_LLEVAR
            ? "para llevar"
            : "mesa " + tableNumber}
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row px-4'>
          <div className='flex flex-col w-[calc(100vw_-_150px)] mr-4'>
            <div className='flex flex-row justify-between'>
              <p className='text-right'>
                {formatDateTime(information?.creatAt || "")}
              </p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>Atiende:</p>
              <p className='text-right'>{wainterName}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>Mesa:</p>
              <p className='text-right'>
                {tableNumber === DEFAULT_TABLE_LLEVAR
                  ? "Para llevar"
                  : "Mesa " + tableNumber}
              </p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>Subtotal:</p>
              <p className='text-right'>{currencyFormat(subtotal)}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>IVA:</p>
              <p className='text-right'>{currencyFormat(total - subtotal)}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p>Total:</p>
              <p className='text-right'>{currencyFormat(total)}</p>
            </div>
          </div>
          <div className='flex'>
            <QRCode value={url} size={150} />
          </div>
        </div>
        <hr className='w-full my-2' />
        {information && information.uuid === orderId && canSplitBill && (
          <div className='px-4 pb-2'>
            <button
              type='button'
              aria-expanded={showDivision}
              onClick={() => setShowDivision((open) => !open)}
              className='rounded bg-blue px-4 py-2 font-secondary text-white'
            >
              {showDivision ? "Ocultar división" : "Dividir cuenta"}
            </button>
            {showDivision && (
              <DinersDivisionForm key={orderId} order={information} />
            )}
          </div>
        )}
        <p className='text-center'>ORDENES</p>
        <hr className='w-full my-2' />
        <div className='w-full px-4'>
          <table className='w-full'>
            <thead>
              <tr>
                <td className='font-bold print-text'>Cant.</td>
                <td className='font-bold print-text'>Descripción</td>
                <td className='font-bold print-text'>Prec. Unit</td>
                <td className='font-bold print-text'>Importe</td>
              </tr>
            </thead>
            <tbody>
              {information?.dishesDescription !== undefined ? (
                groupOrderDishes(information.dishesDescription).map((itm) => (
                  <tr
                    className={`font-secondary print-text ${
                      itm.number === 0 ? "no-print" : ""
                    }} `}
                    key={itm.key}
                  >
                    <td className={itm.number === 0 ? "no-print" : ""}>
                      {itm.number}
                    </td>
                    <td className={itm.number === 0 ? "no-print" : ""}>
                      {itm.name}
                    </td>
                    <td className={itm.number === 0 ? "no-print" : ""}>
                      {currencyFormat(itm.price)}
                    </td>
                    <td className={itm.number === 0 ? "no-print" : ""}>
                      {currencyFormat(itm.price * itm.number)}
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
        </div>
      </div>
    </ProtectPage>
  );
};

export default NotePage;
