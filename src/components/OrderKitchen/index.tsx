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
import { getKitchenOrderAction } from "@/utils/kitchenOrder";

export const OrderKitchen = ({ itm, kitchenType, onClick }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const action = getKitchenOrderAction(itm, kitchenType);
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

  const handleClick = async () => {
    if (!action) return;
    setLoading(true);
    setError("");
    try {
      await onClick(itm, action);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la comanda.",
      );
    } finally {
      setLoading(false);
    }
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
        {itm.notes && (
          <p className='mx-2 mt-2 whitespace-pre-wrap break-words rounded-lg bg-amber-50 p-2 text-sm text-slate-900'>
            <strong>Notas de la orden</strong>
            <br />
            {itm.notes}
          </p>
        )}
        <OrderDishSummary
          dishes={itm.dishesDescription}
          kitchen={{ type: kitchenType }}
        />
        {error && (
          <p role='alert' className='px-2 text-sm text-danger-dark'>
            {error}
          </p>
        )}
        <div className='p-1 bottom-1 w-full'>
          {loading ? (
            <div className='flex items-center'>
              <span className='loader mr-4'></span> Guardando información
            </div>
          ) : (
            action && (
              <button
                onClick={handleClick}
                className={`p-2 w-full bottom-0 rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
                  itm.status,
                )} disabled:bg-gray`}
              >
                {action === "finish" ? (
                  <>
                    <Notifications /> Terminar platillos
                  </>
                ) : (
                  <>
                    <KeyboardArrowRight /> Iniciar preparación
                  </>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
