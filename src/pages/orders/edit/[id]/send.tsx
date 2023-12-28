import { StatusEnum } from "@/enums/states.enum";
import ProtectPage from "@/pages/admin/components/protectPage";
import { UOrderReq } from "@/pages/api/types/Order/order.type";
import { sendApplicationOrderEdit, updateOrderService } from "@/services/order";
import { IOrderSlice } from "@/store/slices/orders.slice";
import { IUserRedux } from "@/store/slices/user.slice";
import { TMenuResponse, TResponseOrders } from "@/types/menu.types";
import { TOKEN_ID } from "@/utils/strings";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { ArrowBack, RoomService, Send } from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type TDish = TMenuResponse & { number?: number; image?: string };
type TDishesDescription = Array<TDish>;

const MessageComponent = withReactContent(Swal);

const SendOrderPage = () => {
  const [dishState, setDishState] = useState("");
  const [tableNumber, setTableNumber] = useState(0);
  const [dishesDescription, setDishesDescription] =
    useState<TDishesDescription>([]);

  const [loading, setLoadin] = useState(false);

  const dispatch = useDispatch();
  const dishStore: IOrderSlice = useSelector((itm: any) => itm.ordersDishes);
  const userStore: IUserRedux = useSelector((store: any) => store.user);

  const router = useRouter();
  const { query } = useRouter();
  //Handlers
  const sendOrder = async () => {
    setLoadin(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    const payload: any = {
      modifications: {
        dishesDescription: dishStore.dishesDescription,
        dishes: dishStore.dishes,
        name: dishStore.name,
        tableNumber: dishStore.tableNumber,
      },
      waiter: userStore.uuid,
    };
    if (query.id && token) {
      const id: string = query.id as string;
      const response = await sendApplicationOrderEdit(token, id, payload);
      if (response) {
        MessageComponent.fire({
          icon: "success",
          title: "Orden enviada",
          text: "Se envio la orden correctamente ",
          confirmButtonText: "Finalizar",
          showConfirmButton: true,
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
          preConfirm: () => router.push(`/orders/myOrders`),
        });
      } else {
        showMessage(
          "Ocurrio un error",
          "Error al actualizar la orden, intenta de nuevo",
          "Entendido",
          "error",
        );
      }
    }
    setLoadin(false);
  };

  //Funcion para mostrar mensajes
  const showMessage = (
    title: string,
    description: string,
    okText?: string,
    icon?: "error" | "success",
  ) => {
    MessageComponent.fire({
      icon: icon || "success",
      title: title,
      text: description,
      timer: 1500,
      confirmButtonText: okText,
      showConfirmButton: false,
      showLoaderOnConfirm: false,
      showLoaderOnDeny: false,
    });
  };

  //Initial charger

  const init = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      if (snapshot.exists() && query.id !== undefined) {
        const id: any = query.id;
        const arrayOrders: Array<TResponseOrders> = snapshot.val();
        const data = arrayOrders[id];
        setDishState(data.status);
        setTableNumber(data.tableNumber);
        setDishesDescription(data.dishesDescription);
      }
    });
  }, [query]);

  useEffect(() => {
    init();
  }, [query]);

  return (
    <ProtectPage push={router.push}>
      <Head>
        <title>Listado Ordenes</title>
      </Head>
      <div className='w-full fixed z-30 bg-white'>
        <div className='font-primary text-[1.5rem] p-4 flex flex-row'>
          <div className='basis-1/5'>
            <button onClick={router.back}>
              <ArrowBack fontSize='large' />
            </button>
          </div>
          <div className='basis-2/5 flex items-center font-bold'>
            <RoomService fontSize='large' className='mr-4' />
            Mesa {tableNumber}
          </div>
          <div className='!text-[0.75rem] !font-bold basis-2/5'>
            <p className='text-center'>Estatus:</p>
            <p className='text-center'>{dishState}</p>
          </div>
        </div>
        <div className='flex flex-col [&>*:nth-child(odd)]:bg-blue [&>*:nth-child(odd)]:text-white'>
          {dishStore.dishesDescription.map((itm) => (
            <div className='flex flex-row justify-between px-4 py-2 font-secondary text-[1.5rem]'>
              <div>{itm.name}</div> <div>{itm.number}</div>
            </div>
          ))}
        </div>
      </div>
      {loading ? (
        <div className='flex items-center flex fixed bottom-0 z-20 px-4 py-2'>
          <span className='loader mr-4'></span> Enviando solicitud
        </div>
      ) : (
        <button
          className='w-full flex fixed bottom-0 z-20 bg-success text-white text-[1.5rem] itmes-center justify-center flex font-secondary py-2'
          onClick={sendOrder}
          disabled={loading}
        >
          <Send className='mr-6' /> Mandar solicitud
        </button>
      )}
    </ProtectPage>
  );
};

export default SendOrderPage;
