import OrderDishSummary from "@/components/orders/OrderDishSummary";
import { StatusEnum } from "@/enums/states.enum";
import { updateOrderService } from "@/services/order";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { URL_BASE } from "@/utils/urls";
import {
  AssignmentTurnedIn,
  DoDisturb,
  PrintOutlined,
} from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";

type TProps = {
  itm: TResponseOrders;
  onDelete?: (itm: TResponseOrders) => void;
};

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

const TicketAdmin = ({ itm, onDelete }: TProps) => {
  const [loading, setLoading] = useState(false);
  const [openModalFinish, setOpenModalFinish] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);

  const toggleModalFinish = () => setOpenModalFinish(!openModalFinish);
  const toggleModalCancel = () => setOpenModalCancel(!openModalCancel);

  const handleFinishOrder = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      const update = await updateOrderService(
        token,
        itm.uuid,
        StatusEnum.CLOSED,
      );
      if (update) {
        toggleModalFinish();
      }
    }
    setLoading(false);
  };

  const handleCloseOrder = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      const update = await updateOrderService(
        token,
        itm.uuid,
        StatusEnum.CANCELED,
      );
      if (update) {
        toggleModalCancel();
      }
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
        {itm.status === StatusEnum.CANCELED && (
          <div className='w-full bg-waiting-dark text-white p-2'>
            <DoDisturb /> Orden cancelada
          </div>
        )}
        {itm.status === StatusEnum.CLOSED && (
          <div className='w-full bg-aqua text-white p-2'>
            <AssignmentTurnedIn /> Orden finalizada
          </div>
        )}
        {itm.status === StatusEnum.SEND && (
          <div className='w-full bg-aqua text-white p-2'>Orden sin atender</div>
        )}
        {itm.status === StatusEnum.IN_PROGRESS && (
          <div className='w-full bg-waiting-dark text-white p-2'>
            Orden atendiendose en cocina
          </div>
        )}
        {itm.status === StatusEnum.ORDER_READY && (
          <div className='w-full bg-success-dark text-white p-2'>
            Orden lista
          </div>
        )}
        {itm.status === StatusEnum.EDITED && (
          <div className='w-full bg-orange-dark text-white p-2'>
            Orden editada
          </div>
        )}
        <div className='font-secondary w-full text-[1.5rem] px-2'>
          {itm.tableNumber === DEFAULT_TABLE_LLEVAR && "Orden para llevar"}
          {itm.tableNumber !== DEFAULT_TABLE_LLEVAR && (
            <>Orden de la mesa {itm.tableNumber}</>
          )}
        </div>
        {itm.tableNumber === DEFAULT_TABLE_LLEVAR && (
          <div className='font-secondary w-full text-[0.75rem] px-2 py-2'>
            Cliente: {itm.name}
          </div>
        )}
        <div className='font-secondary w-full px-2'>Platillos {itm.dishes}</div>
        <OrderDishSummary dishes={itm.dishesDescription} />
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
          {itm.status !== StatusEnum.CLOSED &&
            itm.status !== StatusEnum.CANCELED &&
            itm.status !== StatusEnum.ORDER_READY && (
              <button
                className='w-full bg-waiting-dark text-white font-primary p-2'
                onClick={toggleModalCancel}
              >
                <DoDisturb /> Cancelar
              </button>
            )}
          {itm.status !== StatusEnum.CLOSED &&
            itm.status !== StatusEnum.CANCELED && (
              <button
                className='w-full bg-aqua text-white font-primary p-2'
                onClick={toggleModalFinish}
              >
                <AssignmentTurnedIn /> Terminar
              </button>
            )}
        </div>
      )}

      <Modal open={openModalFinish} onClose={toggleModalFinish}>
        <Box sx={style}>
          <div className='bg-aqua text-white font-primary text-2xl p-2'>
            <AssignmentTurnedIn /> Desea finalizar la siguiente Orden?
          </div>
          <div>
            Mesa:
            {itm.tableNumber !== DEFAULT_TABLE_LLEVAR
              ? itm.tableNumber
              : "PARA LLEVAR"}
          </div>
          <div>
            Cliente:{itm.name !== "" ? itm.name : "Sin cliente registrado"}
          </div>
          <div className='w-full flex flex-row justify-between mt-4'>
            {loading ? (
              <div className='flex items-center p-2 font-secondary'>
                <span className='loader mr-4'></span> Guardando
              </div>
            ) : (
              <>
                {" "}
                <button
                  onClick={toggleModalFinish}
                  className='bg-gray p-2 font-secondary rounded-lg text-white'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinishOrder}
                  className='bg-danger p-2 font-secondary rounded-lg text-white hover:bg-danger-dark transition-all'
                >
                  Finalizar
                </button>
              </>
            )}
          </div>
        </Box>
      </Modal>

      <Modal open={openModalCancel} onClose={toggleModalCancel}>
        <Box sx={style}>
          <div className='bg-aqua text-white font-primary text-2xl p-2'>
            <DoDisturb /> Desea cancelar la siguiente Orden?
          </div>
          <div>
            Mesa:
            {itm.tableNumber !== DEFAULT_TABLE_LLEVAR
              ? itm.tableNumber
              : "PARA LLEVAR"}
          </div>
          <div>
            Cliente:{itm.name !== "" ? itm.name : "Sin cliente registrado"}
          </div>
          <div className='w-full flex flex-row justify-between mt-4'>
            {loading ? (
              <div className='flex items-center p-2 font-secondary'>
                <span className='loader mr-4'></span> Guardando
              </div>
            ) : (
              <>
                {" "}
                <button
                  onClick={toggleModalCancel}
                  className='bg-gray p-2 font-secondary rounded-lg text-white'
                >
                  Cerrar
                </button>
                <button
                  onClick={handleCloseOrder}
                  className='bg-waiting-dark p-2 font-secondary rounded-lg text-white hover:bg-danger-dark transition-all'
                >
                  Aceptar
                </button>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

TicketAdmin.defaultProps = {
  itm: {},
  handlePrintData: () => {},
};

export default TicketAdmin;
