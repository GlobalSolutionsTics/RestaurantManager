import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import MenuAdmin from "./components/menu";
import Head from "next/head";
import ProtectPage from "./components/protectPage";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { TResponseOrders } from "@/types/menu.types";
import {
  AssignmentTurnedIn,
  DeleteForeverOutlined,
  EditOutlined,
  PrintOutlined,
} from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import Image from "next/image";
import { currencyFormat, textToString } from "@/utils/formats";
import TicketAdmin from "./components/ticketAdmin";
import { StatusEnum } from "@/enums/states.enum";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const OrdersPage = () => {
  const [orderList, setOrderList] = useState<Array<TResponseOrders>>([]);
  const [dataOrderSelected, setDataOrderSelected] = useState<TResponseOrders>({
    name: "",
    uuid: "",
    dishes: 0,
    tableNumber: 0,
    dishesDescription: [],
    status: "",
  });
  //Modal controller
  const [showModalPrint, setShowModalPrint] = useState(false);

  const router = useRouter();
  //Print controller
  const componentRef = useRef(null);

  //Handle functions
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const handlePrintData = (data: TResponseOrders) => {
    setDataOrderSelected(data);
    setShowModalPrint(true);
  };

  //Toggle functions
  const toggleModalPrint = () => {
    if (showModalPrint) {
      setDataOrderSelected({
        name: "",
        uuid: "",
        dishes: 0,
        tableNumber: 0,
        dishesDescription: [],
        status: "",
      });
      setShowModalPrint(false);
    } else {
      setShowModalPrint(true);
    }
  };

  const autheticate = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
  }, []);

  useEffect(() => {
    autheticate();
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      if (snapshot.exists()) {
        const data: Array<TResponseOrders> = snapshot.val();
        const elements: Array<TResponseOrders> = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId,
        );
        const filters = elements.filter(
          (itm) => itm.status !== StatusEnum.CLOSED,
        );
        setOrderList(filters);
      }
    });
  }, []);

  return (
    <ProtectPage push={router.push}>
      <Head>
        <title>Administrador | Ordenes</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
        <div className='flex flex-col w-full h-min-[100vh] px-8 py-4'>
          <p className='font-primary text-[2rem] mb-4 text-black'>
            Listado de ordenes actuales
          </p>
          <div className='grid lg:grid-cols-4 lg:gap-4 md:grid-cols-3 md:gap-3 sm:grid-cols-1 sm:gap-1 overflow-y-auto '>
            {orderList.length > 0 &&
              orderList.map((itm) => (
                <TicketAdmin
                  key={itm.uuid}
                  itm={itm}
                  handlePrintData={handlePrintData}
                />
              ))}
          </div>
        </div>
      </div>
      <Modal open={showModalPrint} onClose={toggleModalPrint}>
        <Box sx={style}>
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
            <p className='font-primary font-bold text-center mb-2'>
              MARIS QUERIDA
            </p>
            <p className='font-secondary mb-2 mb-2'>
              Valle del vístula esquina Valle de Oaxaca. Valle de Aragon 2da
              Secc, 57100 Nezahualcóyotl, Méx., Mexico City, Mexico
            </p>
            <p className='font-secondary text-center mb-2'>
              COMPROBANTE DE PAGO
            </p>
            <div className='gird grid-cols-3 font-secondary gap-3 mb-2'>
              <div>Mesa {dataOrderSelected.tableNumber}</div>
            </div>
            <div className='grid grid-cols-4 font-secondary gap-4'>
              <div className='font-bold'>Cant.</div>
              <div className='font-bold'>Desc.</div>
              <div className='font-bold'>Precio Unit.</div>
              <div className='font-bold'>Importe</div>
            </div>
            {dataOrderSelected.dishesDescription.map((itm) => (
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
                dataOrderSelected.dishesDescription.reduce(
                  (prev, next) => prev + next.number * next.price,
                  0,
                ),
              )}
            </div>
            <div className='font-secondary text-[1.25rem] w-full mt-4'>
              {textToString(
                dataOrderSelected.dishesDescription.reduce(
                  (prev, next) => prev + next.number * next.price,
                  0,
                ),
              )}{" "}
              pesos
            </div>
          </div>
        </Box>
      </Modal>
    </ProtectPage>
  );
};

export default OrdersPage;
