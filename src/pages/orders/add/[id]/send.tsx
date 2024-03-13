import ProtectPage from "@/pages/admin/components/protectPage";
import { sendApplicationOrderAdd, updateOrderService } from "@/services/order";
import {
  IOrderSlice,
  resetComanda,
  resetTableNumber,
  setDishesDescriptionRedux,
} from "@/store/slices/orders.slice";
import { IUserRedux } from "@/store/slices/user.slice";
import { TMenuResponse, TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { getActualDateDB } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS } from "@/utils/users";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { ArrowBack, Check, Edit, RoomService, Send } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type TDish = TMenuResponse & { number?: number; image?: string };
type TDishesDescription = Array<TDish>;

const MessageComponent = withReactContent(Swal);

type Props = {
  name: string;
  dishesNumber: number;
  price: number;
  uuid: string;
  onChange: (a: any, b: any, c: any, d: any) => void;
  onOpen?: (val: any) => void;
};

const FieldEditedOption = ({
  name,
  dishesNumber,
  price,
  uuid,
  onChange,
  onOpen,
}: Props) => {
  const [editValues, setEditValues] = useState(false);
  const [initialPrice, setInitialPrice] = useState(price);

  const INITAL_VALUES = {
    name: name,
    dishesNumber: dishesNumber,
    price: price,
  };

  const toggleEdit = () => {
    if (onOpen) {
      if (editValues) {
        onOpen(false);
      } else {
        onOpen(true);
      }
    }
    setEditValues(!editValues);
  };

  const formik = useFormik({
    initialValues: INITAL_VALUES,
    onSubmit: () => {},
  });

  const handleChangeEdit = () => {
    const values = formik.values;
    toggleEdit();
    return onChange(values.name, values.dishesNumber, values.price, uuid);
  };

  return (
    <>
      <div className='w-full flex justify-between bg-enabled-dark py-2 px-2'>
        <div className='text-secondary text-[1rem] basis-4/6'>
          {formik.values.name}
        </div>
        <div className='basis-1/6'>{formik.values.dishesNumber}</div>
        <div className='basis-1/6 flex justify-end'>
          {editValues ? (
            <button onClick={handleChangeEdit}>
              <Check />
            </button>
          ) : (
            <button onClick={toggleEdit}>
              <Edit />
            </button>
          )}
        </div>
      </div>
      {editValues && (
        <div className='flex flex-col bg-enabled p-4'>
          <TextField
            className='text-secondary text-[1rem] w-full basis-4/6 !mb-4 bg-white'
            value={formik.values.name}
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            variant='outlined'
            label='Platillo'
          />
          <TextField
            className='text-secondary text-[1rem] w-full basis-4/6 !mb-4 bg-white'
            value={formik.values.dishesNumber}
            onChange={formik.handleChange("dishesNumber")}
            onBlur={formik.handleBlur("dishesNumber")}
            variant='outlined'
            label='Cantidad'
            type='number'
            inputMode='numeric'
          />
          <TextField
            className='text-secondary text-[1rem] w-full basis-4/6 bg-white disabled:!bg-enabled disabled:!text-dark'
            value={formik.values.price}
            onChange={formik.handleChange("price")}
            onBlur={formik.handleBlur("price")}
            disabled={initialPrice !== 0}
            variant='outlined'
            label='Costo'
            type='number'
            inputMode='numeric'
          />
        </div>
      )}
    </>
  );
};

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
  const onChangeDish = (
    name: string,
    dishNumber: number,
    price: number,
    uuid: string,
  ) => {
    const dishesDescription: Array<TMenuResponse> = dishStore.dishesDescription;

    const newDish = dishesDescription.map((itm) => {
      if (itm.uuid === uuid) {
        return { ...itm, name: name, price: price, number: dishNumber };
      }
      return itm;
    });
    dispatch(setDishesDescriptionRedux(newDish));
  };
  const sendOrder = async () => {
    setLoadin(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    const payload: any = {
      modifications: {
        dishesDescription: dishStore.dishesDescription,
        dishes: dishStore.dishes,
        name: dishStore.name,
        tableNumber: dishStore.tableNumber,
        orderUUID: dishStore.id,
      },
      waiter: userStore.uuid,
    };
    if (query.id && token) {
      const id: string = query.id as string;
      const response = await sendApplicationOrderAdd(token, id, payload);
      if (response) {
        dispatch(resetComanda());
        dispatch(resetTableNumber());
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
    const date = getActualDateDB();
    const DB_RT =
      RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
    const connection = ref(realtimeDB, DB_RT);
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

  const token = sessionStorage.getItem(TOKEN_ID);
  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS} token={token!}>
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
            {tableNumber === DEFAULT_TABLE_LLEVAR && <>Para llevar</>}
            {tableNumber !== DEFAULT_TABLE_LLEVAR && <>Mesa {tableNumber}</>}
          </div>
          <div className='!text-[0.75rem] !font-bold basis-2/5'>
            <p className='text-center'>Estatus:</p>
            <p className='text-center'>{dishState}</p>
          </div>
        </div>
        <div className='flex flex-row bg-enabled px-2'>
          <div className='basis-4/6'>Descripción</div>
          <div className='basis-1/6'>Cantidad</div>
          <div className='basis-1/6'></div>
        </div>
        <div className='flex flex-col bg-enabled'>
          {dishStore.dishesDescription.map((itm) => (
            <FieldEditedOption
              uuid={itm.uuid || ""}
              name={itm.name}
              price={itm.price}
              dishesNumber={itm.number || 0}
              onChange={onChangeDish}
            />
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
