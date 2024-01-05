import { StatusEnum } from "@/enums/states.enum";
import { updateOrderService } from "@/services/order";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { URL_BASE } from "@/utils/urls";
import {
  AssignmentTurnedIn,
  DeleteForeverOutlined,
  EditOutlined,
  PrintOutlined,
} from "@mui/icons-material";
import { useState } from "react";

type TProps = {
  itm: TResponseOrders;
  handlePrintData: (itm: TResponseOrders) => void;
};

const TicketAdmin = ({ itm, handlePrintData }: TProps) => {
  const [loading, setLoading] = useState(false);

  const handleFinishOrder = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      await updateOrderService(token, itm.uuid, StatusEnum.CLOSED);
    }
    setLoading(false);
  };

  const handlePrint = (event: any) => {
    event.preventDefault();
    window.open(
      `${URL_BASE}/admin/orders/${itm.uuid}/print`,
      "",
      "width=1200,height=600",
    );
  };

  return (
    <div className='flex flex-col justify-between w-full bg-enabled mb-1 lg:mb-2 border-2 border-blue-dark pt-1 relative'>
      <div className='w-full'>
        <div className='font-secondary w-full text-[1.5rem] px-2'>
          {itm.tableNumber === DEFAULT_TABLE_LLEVAR && "Orden para llevar"}
          {itm.tableNumber !== DEFAULT_TABLE_LLEVAR && (
            <>Orden de la mesa {itm.tableNumber}</>
          )}
        </div>
        <div className='font-secondary w-full px-2'>Platillos {itm.dishes}</div>
        {itm.dishesDescription?.map((itm) => (
          <div
            key={itm.uuid}
            className={`flex flex-row w-full font-primary px-2 ${
              itm.number === 0 ? "bg-danger text-white" : ""
            }`}
          >
            <div className='basis-5/6'>{itm.name}</div>
            <div className='basis-1/6 text-center'>{itm.number}</div>
          </div>
        ))}
        <div className='flex flex-row w-full font-secondary px-2 pt-4 text-[1.5rem]'>
          Total:{" "}
          {currencyFormat(
            itm.dishesDescription?.reduce(
              (prev, next) => prev + next.price * next.number,
              0,
            ),
          )}
        </div>
      </div>
      {loading ? (
        <div className='flex items-center p-2 font-secondary'>
          <span className='loader mr-4'></span> Guardando
        </div>
      ) : (
        <div className=' w-full mt-4'>
          <button
            className='w-full bg-success text-white font-primary p-2'
            onClick={(event) => handlePrint(event)}
          >
            <PrintOutlined /> Imprimir
          </button>
          {itm.status !== StatusEnum.CLOSED && (
            <button
              className='w-full bg-aqua text-white font-primary p-2'
              onClick={handleFinishOrder}
            >
              <AssignmentTurnedIn /> Terminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

TicketAdmin.defaultProps = {
  itm: {},
  handlePrintData: () => {},
};

export default TicketAdmin;
