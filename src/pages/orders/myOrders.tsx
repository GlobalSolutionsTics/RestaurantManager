import { StatusEnum } from "@/enums/states.enum";
import { IUserRedux } from "@/store/slices/user.slice";
import { TResponseOrders } from "@/types/menu.types";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  Add,
  ArrowBack,
  CheckCircle,
  Checklist,
  Edit,
  Notes,
  RoomService,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProtectPage from "../admin/components/protectPage";
import { useRouter } from "next/router";
import Head from "next/head";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { getActualDateDB } from "@/utils/formats";
import { CHECKS, TOKEN } from "@/utils/users";
import OrderDishSummary from "@/components/orders/OrderDishSummary";

enum OptionEnum {
  ACTIVE = "ACTIVES",
  READY = "READY",
}

type Props = {
  element: TResponseOrders;
  push: (page: string) => void;
};

const ToggleColumn = ({ element, push }: Props) => {
  const ADD_PAGE = `/orders/add/${element.uuid}`;
  const EDIT_PAGE = `/orders/edit/${element.uuid}`;
  const NOTE_PAGE = `/orders/notes/${element.uuid}`;
  //Color controller
  const getColorForHeader = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark text-dark";
    } else if (status === StatusEnum.ORDER_READY) {
      return "bg-success-dark text-white";
    } else if (status === StatusEnum.EDITED) {
      return "bg-orange-dark text-dark";
    }

    return "bg-danger-dark text-white";
  };

  const getColorButton = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark hover:bg-waiting-dark hover:text-dark";
    } else if (status === StatusEnum.ORDER_READY) {
      return "bg-success-dark text-white";
    } else if (status === StatusEnum.EDITED) {
      return "bg-orange-dark hover:bg-orange hover:text-dark";
    }

    return "bg-danger hover:bg-danger-dark text-white";
  };

  //Handles
  const handleNote = () => {
    push(NOTE_PAGE);
  };

  const handleEdit = () => {
    push(EDIT_PAGE);
  };

  const handleAdd = () => {
    push(ADD_PAGE);
  };

  return (
    <div className='w-full rounded-lg shadow-lg bg-white flex flex-col justify-between'>
      <div className='flex flex-col'>
        <div
          className={`flex flex-row w-full font-secondary text-bold p-2 ${getColorForHeader(
            element.status,
          )} text-white rounded-t-lg`}
        >
          <div className='text-[1rem] basis-4/6'>
            {element.tableNumber === DEFAULT_TABLE_LLEVAR && "Para llevar"}
            {element.tableNumber !== DEFAULT_TABLE_LLEVAR && (
              <div> Mesa {element.tableNumber}</div>
            )}
          </div>
          <div className='text-[1rem] basis-2/6'>
            <RoomService /> {element.dishes}
          </div>
        </div>
        <OrderDishSummary dishes={element.dishesDescription} />
      </div>
      <div className='p-2'>
        <button
          className={`mb-2 p-1 w-full rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
            element.status,
          )} `}
          onClick={handleAdd}
        >
          <Add /> Añadir
        </button>
        <button
          className={`mb-2 p-1  w-full rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
            element.status,
          )} `}
          onClick={handleEdit}
        >
          <Edit /> Editar
        </button>
        <button
          className={`p-1  w-full rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
            element.status,
          )} `}
          onClick={handleNote}
        >
          <Notes /> Cuenta
        </button>
      </div>
    </div>
  );
};

const MyOrdersPage = () => {
  const [ordersActive, setOrdersActive] = useState<Array<TResponseOrders>>([]);
  const [ordersReady, setordersReady] = useState<Array<TResponseOrders>>([]);
  const [selectOption, setSelectOption] = useState<OptionEnum>(
    OptionEnum.ACTIVE,
  );

  const router = useRouter();

  const personStore: IUserRedux = useSelector((store: any) => store.user);

  /**
   * Services
   */

  const getMyOrders = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const date = getActualDateDB();
    const DB_RT =
      RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
    const connection = ref(realtimeDB, DB_RT);
    return onValue(connection, (snapshot) => {
      const data: Array<TResponseOrders> = snapshot.val();
      if (snapshot.exists()) {
        const elements = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId,
        );
        const filterElementsActive = elements.filter(
          (itm) =>
            (itm.status === StatusEnum.SEND ||
              itm.status === StatusEnum.IN_PROGRESS ||
              itm.status === StatusEnum.EDITED) &&
            itm.waiter === personStore.uuid,
        );
        const filterElementsReady = elements.filter(
          (itm) =>
            itm.status === StatusEnum.ORDER_READY &&
            itm.waiter === personStore.uuid,
        );

        console.log(filterElementsReady, filterElementsActive);

        setOrdersActive(filterElementsActive);
        setordersReady(filterElementsReady);
      } else {
        console.error("No existe data:", DB_RT);
      }
    });
  }, [personStore]);

  /**
   * Carga inicial
   */
  useEffect(() => {
    getMyOrders();
  }, [personStore]);

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Listado Ordenes</title>
      </Head>
      <div className='w-full min-h-[100vh]'>
        <div className='font-primary font-bold text-[1.5rem] p-4 flex flex-row'>
          <div className='basis-1/5'>
            <button onClick={() => router.push("/orders/create")}>
              <ArrowBack fontSize='large' />
            </button>
          </div>
          <div className='basis-4/5'>Ordenes</div>
        </div>
        <div className='mb-[6rem] grid grid-cols-2 gap-2 bg-enabled p-4'>
          {selectOption === OptionEnum.ACTIVE
            ? ordersActive.map((itm, indx) => (
                <ToggleColumn
                  push={router.push}
                  key={itm.uuid + "-" + indx}
                  element={itm}
                />
              ))
            : ordersReady.map((itm, indx) => (
                <ToggleColumn
                  push={router.push}
                  key={itm.uuid + "-" + indx}
                  element={itm}
                />
              ))}
        </div>
        <div className='fixed flex flex-row justify-between w-full bottom-0 bg-white'>
          <button
            className={`basis-1/2 flex flex-col items-center justify-center p-4 ${
              selectOption === OptionEnum.ACTIVE && "bg-blue text-white"
            }`}
            onClick={() => setSelectOption(OptionEnum.ACTIVE)}
          >
            <Checklist fontSize='large' /> Activas ({ordersActive.length})
          </button>
          <button
            className={`basis-1/2 flex flex-col items-center justify-center p-4 ${
              selectOption === OptionEnum.READY && "bg-blue text-white"
            }`}
            onClick={() => setSelectOption(OptionEnum.READY)}
          >
            <CheckCircle fontSize='large' />
            Listas ({ordersReady.length})
          </button>
        </div>
      </div>
    </ProtectPage>
  );
};

export default MyOrdersPage;
