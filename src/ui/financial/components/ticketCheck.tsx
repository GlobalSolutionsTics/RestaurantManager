import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { Order } from "../type";
import { currencyFormat, getFloat } from "@/utils/formats";
import { Typography } from "@mui/material";

type Props = {
  order?: Order;
};
enum EButtonActives {
  EFECTIVE = "EFECTIVO",
  DEBIT = "TARJETA DE DEBITO",
  CREDIT = "TARJETA DE CREDITO",
  VOUCHER = "VALES",
  COUTERSY = "CORTESIA",
}
export const TicketCheck = ({ order }: Props) => {
  if (!order) return <></>;

  const discount = getFloat(order.discount);
  const propine = getFloat(order.propine);
  return (
    <div className='flex flex-col'>
      <Typography variant='h3'>Detalle de la orden</Typography>
      <div>
        Mesa atendida:{" "}
        {order.tableNumber === DEFAULT_TABLE_LLEVAR
          ? "PARA LLEVAR"
          : order.tableNumber}
      </div>
      <div>Fecha y hora del servicio: {order.createdAtFullTm}</div>
      <div>Platillos ordenados: {order.dishesDescription.length}</div>
      <div>Pago con: {order.paymentType}</div>
      <p>Platillos pedidos</p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Unidades</th>
            <th>Precio U</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.dishesDescription.map((dish) => {
            const units = getFloat(dish.number);
            return (
              <tr
                key={dish.uuid}
                className={dish.number === 0 ? "!bg-danger !text-white" : ""}
              >
                <td>{dish.name}</td>
                <td>{dish.number}</td>
                <td>{currencyFormat(dish.price)}</td>
                <td>{currencyFormat(dish.price * units)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className='bg-blue-light p-2'>Detalles de pago</p>
      <div>Descuento: {currencyFormat(discount)}</div>
      <div>Propina: {currencyFormat(propine)}</div>
      <div>Subtotal: {currencyFormat(order.total ?? 0)}</div>
      <div>Total: {currencyFormat(order.total + propine - discount)}</div>
      {order.paymentType !== EButtonActives.DEBIT &&
        order.paymentType !== EButtonActives.CREDIT && (
          <>
            <div>
              Pago con: {currencyFormat(parseFloat(order.payWith ?? 0))}
            </div>
            <div>Cambio: {currencyFormat(order.shift ?? 0)}</div>
          </>
        )}
    </div>
  );
};
