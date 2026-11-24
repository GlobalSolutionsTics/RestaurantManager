import { StatusEnum } from "@/enums/states.enum";
import type { Props } from "./type";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import OrderDishSummary from "@/components/orders/OrderDishSummary";
import {
  CheckCircle,
  HourglassFull,
  KeyboardArrowRight,
  Notifications,
  Timer,
} from "@mui/icons-material";
import { useState } from "react";
import { TResponseOrders } from "@/types/menu.types";

export const OrderKitchen = ({ itm, onClick }: Props) => {
  const [loading, setLoading] = useState(false);
  const STATUS_TXT = itm.status === StatusEnum.SEND ? "PENDIENTE" : itm.status;
  const IS_TO_GONE = itm.tableNumber === DEFAULT_TABLE_LLEVAR;
  const TABLE = IS_TO_GONE ? "Para llevar" : "Mesa " + itm.tableNumber;

  const getIconHeader = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return <HourglassFull className='animate-spin' />;
    } else if (status === StatusEnum.ORDER_READY) {
      return <CheckCircle />;
    }

    return <Timer className='animate-pulse' />;
  };

  const getIconButton = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return (
        <>
          <Notifications /> Terminar Orden
        </>
      );
    }

    return (
      <>
        <KeyboardArrowRight /> Iniciar Orden
      </>
    );
  };

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
    } else if (
      status === StatusEnum.ORDER_READY ||
      status === StatusEnum.CLOSED ||
      status === StatusEnum.CANCELED
    ) {
      return "bg-success-dark text-white hidden";
    } else if (status === StatusEnum.EDITED) {
      return "bg-orange-dark hover:bg-orange hover:text-dark";
    }

    return "bg-danger hover:bg-danger-dark text-white";
  };

  const handleClick = async (val: TResponseOrders) => {
    setLoading(true);
    await onClick(val);
    setLoading(false);
  };

  return (
    <div className='rounded-lg mb-4'>
      <div
        className={`transition ease-in-out delay-150 ${getColorForHeader(
          itm.status,
        )} text-[1.5rem] font-secondary w-full rounded-t-lg p-4`}
      >
        {getIconHeader(itm.status)} {TABLE}
        <p className='font-secondary text-[1rem]'>Estatus: {STATUS_TXT}</p>
      </div>
      <div className='bg-enabled rounded-b-lg flex flex-col flex-start justify-between'>
        <OrderDishSummary dishes={itm.dishesDescription} />
        <div className='p-1 bottom-1 w-full'>
          {loading ? (
            <div className='flex items-center'>
              <span className='loader mr-4'></span> Guardando información
            </div>
          ) : (
            <button
              onClick={() => handleClick(itm)}
              className={`p-2 w-full bottom-0 rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
                itm.status,
              )} disabled:bg-gray`}
            >
              {getIconButton(itm.status)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
