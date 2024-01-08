import ProtectPage from "@/pages/admin/components/protectPage";
import { listUserSerive } from "@/services/users";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat, formatDateTime } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { ArrowBack } from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";

const NotePage = () => {
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
  }, [information, query]);

  const init = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      if (snapshot.exists() && query.id !== undefined) {
        const id: any = query.id;
        const arrayOrders: Array<TResponseOrders & { creatAt: string }> =
          snapshot.val();
        const data = arrayOrders[id];
        const getTotal = data?.dishesDescription.reduce(
          (prev, next) => prev + next.number * next.price,
          0,
        );
        const getSubtotal = getTotal / 1.16;

        setTotal(getTotal);
        setSubtotal(getSubtotal);
        setInformation(data);
        setTableNumber(data.tableNumber);
      }
    });
  }, [query]);

  useEffect(() => {
    init();
    getWinterInformation();
  }, [query, information?.waiter]);
  return (
    <ProtectPage push={router.push}>
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
                information?.dishesDescription.map((itm, idx) => (
                  <tr
                    className={`font-secondary print-text ${
                      itm.number === 0 ? "no-print" : ""
                    }} `}
                    key={itm.uuid + "-" + idx}
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
