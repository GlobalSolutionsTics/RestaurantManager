import { StatusEnum } from "@/enums/states.enum";
import { IUserRedux } from "@/store/slices/user.slice";
import { TResponseOrders } from "@/types/menu.types";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  ArrowBack,
  CheckCircle,
  Checklist,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowRight,
  RoomService,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProtectPage from "../admin/components/protectPage";
import { useRouter } from "next/router";
import Head from "next/head";
import Joyride from "react-joyride";

enum OptionEnum {
  ACTIVE = "ACTIVES",
  READY = "READY",
}

type Props = {
  element: TResponseOrders;
};

const ToggleColumn = ({ element }: Props) => {
  //Color controller
  const getColorForHeader = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark text-dark";
    } else if (status === StatusEnum.ORDER_READY) {
      return "bg-success-dark text-white";
    }

    return "bg-danger-dark text-white";
  };

  const getColorButton = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark hover:bg-waiting-dark hover:text-dark";
    } else if (status === StatusEnum.ORDER_READY) {
      return "bg-success-dark text-white";
    }

    return "bg-danger hover:bg-danger-dark text-white";
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
            Mesa {element.tableNumber}
          </div>
          <div className='text-[1rem] basis-2/6'>
            <RoomService /> {element.dishes}
          </div>
        </div>
        <div className='p-2 flex flex-col'>
          {element.dishesDescription.map((dish) => (
            <div key={dish.uuid} className='flex flex-row font-secondary'>
              <div className='basis-5/6'>{dish.name}</div>
              <div className='basis-1/6'>{dish.number}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='p-2'>
        <button
          className={`p-1 w-full rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
            element.status,
          )} `}
        >
          <Edit /> Editar
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
  const [tour, setTour] = useState(false);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any>([]);

  const router = useRouter();

  const personStore: IUserRedux = useSelector((store: any) => store.user);

  /**
   * Services
   */

  const getMyOrders = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const connection = ref(realtimeDB, RT_ORDER_TABLE_NAME);
    return onValue(connection, (snapshot) => {
      const data: Array<TResponseOrders> = snapshot.val();
      if (snapshot.exists()) {
        const elements = Object.values(data).sort(
          (a: any, b: any) => a.orderId - b.orderId,
        );
        const filterElementsActive = elements.filter(
          (itm) =>
            itm.status !== StatusEnum.ORDER_READY &&
            itm.waiter === personStore.uuid,
        );
        const filterElementsReady = elements.filter(
          (itm) =>
            itm.status === StatusEnum.ORDER_READY &&
            itm.waiter === personStore.uuid,
        );
        setOrdersActive(filterElementsActive);
        setordersReady(filterElementsReady);
      }
    });
  }, [personStore]);

  /**
   * Carga inicial
   */
  useEffect(() => {
    getMyOrders();
  }, [personStore]);

  const handleTour = useCallback(() => {
    setTour(true);
  }, []);

  useEffect(() => {
    const joyrideSteps = [
      {
        content: (
          <h2 className='text-2xl'>
            En esta ventana se mostraran las ordenes en proceso y cuando esten
            terminadas.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: (
          <h2 className='text-2xl'>
            Se muestran las ordenes que se han hecho.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#first-step",
        title: "Ordenes Activas",
      },
      {
        content: (
          <h2 className='text-2xl'>
            En esta ventana se mostraran las ordenes que ya estan listas.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#second-step",
        title: "Ordenes listas",
      },
      {
        content: (
          <h2 className='text-2xl'>
            Te regresará a la pantalla principal para meseros.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#thirth-step",
        title: "Mis ordenes",
      },
    ];

    setRun(tour);
    setSteps(joyrideSteps);
  }, [tour]);

  return (
    <ProtectPage push={router.push}>
      <Joyride
        continuous
        callback={() => {}}
        run={run}
        steps={steps}
        scrollToFirstStep
        hideCloseButton
        showSkipButton
        showProgress
      />
      <Head>
        <title>Listado Ordenes</title>
      </Head>
      <div className='w-full min-h-[100vh]'>
        <div className='font-primary font-bold text-[1.5rem] p-4 flex flex-row'>
          <div className='basis-1/5'>
            <button className='bg-white' onClick={router.back} id='thirth-step'>
              <ArrowBack fontSize='large' />
            </button>
          </div>
          <div className='basis-4/5'>Ordenes</div>
        </div>
        <button
          className='bg-red-800 text-white w-20 h-8 rounded mx-2'
          onClick={handleTour}
        >
          Tutorial
        </button>
        <div className='mb-[6rem] grid grid-cols-2 gap-2 bg-enabled p-4'>
          {selectOption === OptionEnum.ACTIVE
            ? ordersActive.map((itm) => (
                <ToggleColumn key={itm.uuid} element={itm} />
              ))
            : ordersReady.map((itm) => (
                <ToggleColumn key={itm.uuid} element={itm} />
              ))}
        </div>
        <div className='fixed flex flex-row justify-between w-full bottom-0 bg-white'>
          <button
            className={`basis-1/2 flex flex-col items-center justify-center p-4 ${
              selectOption === OptionEnum.ACTIVE && "bg-blue text-white"
            }`}
            onClick={() => setSelectOption(OptionEnum.ACTIVE)}
            id='first-step'
          >
            <Checklist fontSize='large' /> Activas ({ordersActive.length})
          </button>
          <button
            className={`basis-1/2 flex flex-col items-center justify-center p-4 ${
              selectOption === OptionEnum.READY && "bg-blue text-white"
            }`}
            onClick={() => setSelectOption(OptionEnum.READY)}
            id='second-step'
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
