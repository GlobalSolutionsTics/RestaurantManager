import Image from "next/image";
import { forwardRef } from "react";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat, formatDateTime, textToString } from "@/utils/formats";
import { groupOrderDishes } from "@/utils/groupOrderDishes";
import type { PaymentTicketProps } from "./interfaces";

export const PaymentTicketComponent = forwardRef<
  HTMLDivElement,
  PaymentTicketProps
>(function PaymentTicketComponent(
  {
    information,
    total,
    waiterName,
    selectedClients,
    showPaymentInfo,
    showDiscount,
  },
  ref,
) {
  const division = information.dinersDivisionTotal ?? [];
  const unassignedCents =
    Math.round((total || 0) * 100) -
    division.reduce((sum, diner) => sum + Math.round(diner.total * 100), 0);

  return (
    <div ref={ref} className='basis-1/2 mb-4 px-4'>
      <div className='flex items-center justify-center'>
        <Image
          src={"/logo_con_fondo.png"}
          width={100}
          height={100}
          alt='Image logo'
        />
      </div>
      <p className='font-primary font-bold text-center mb-2 print-title'>
        MARIS QUERIDA
      </p>
      <p className='font-secondary mb-2 text-center print-text'>
        Valle del vístula esquina Valle de Oaxaca. Valle de Aragon 2da Secc,
        57100 Nezahualcóyotl, Méx., Mexico City, Mexico
      </p>
      <hr className='my-2' />
      <table className='w-full'>
        <tr>
          <td className='print-text-small'>Fecha y hora de entrada:</td>
          <td className='print-text-small text-right'>
            {formatDateTime(information?.creatAt || "")}
          </td>
        </tr>
        <tr>
          <td className='print-text-small'>Mesero:</td>
          <td className='print-text-small text-right'>{waiterName}</td>
        </tr>
        <tr>
          <td className='print-text-small'>Mesa:</td>
          <td className='print-text-small text-right'>
            {information?.tableNumber === DEFAULT_TABLE_LLEVAR
              ? "PARA LLEVAR"
              : "MESA " + information.tableNumber}
          </td>
        </tr>
        {information?.tableNumber === DEFAULT_TABLE_LLEVAR && (
          <tr>
            <td className='print-text-small'>Cliente:</td>
            <td className='print-text-small text-right'>{information.name}</td>
          </tr>
        )}
      </table>
      <table className='w-full'>
        {selectedClients?.length !== 0 && (
          <thead className='w-full'>
            <tr>
              <td className='print-text-small'>Cliente:</td>
              <td className='print-text-small text-right'>
                {selectedClients[0].name}
              </td>
            </tr>
            <tr>
              <td className='print-text-small'>Dirección:</td>
              <td className='print-text-small text-right'>
                {selectedClients[0].adress}
              </td>
            </tr>
            <tr>
              <td className='print-text-small'>Telefono:</td>
              <td className='print-text-small text-right'>
                {selectedClients[0].phone}
              </td>
            </tr>
          </thead>
        )}
      </table>
      <hr className='my-2' />
      <table className='w-full'>
        <thead>
          <tr>
            <td className='font-bold print-text'>Cant.</td>
            <td className='font-bold print-text'>Descripción</td>
            <td className='font-bold print-text text-left'>Importe</td>
          </tr>
        </thead>
        <tbody>
          {information?.dishesDescription !== undefined ? (
            groupOrderDishes(information.dishesDescription).map((itm) => (
              <tr
                key={itm.key}
                className={`font-secondary print-text ${
                  itm.number === 0 ? "no-print" : ""
                }} `}
              >
                <td className={itm.number === 0 ? "no-print" : ""}>
                  {itm.number}
                </td>
                <td className={itm.number === 0 ? "no-print" : ""}>
                  {itm.name}
                </td>
                <td className={itm.number === 0 ? "no-print" : "text-left"}>
                  {currencyFormat(itm.price * itm.number)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      <hr className='my-2' />
      <table className='w-full'>
        <tr>
          <td className='print-text-small'>TOTAL:</td>
          <td className='print-text-small text-right'>
            {currencyFormat(total || 0)}
          </td>
        </tr>
      </table>
      <div className='font-secondary text-[1.25rem] w-full my-2 print-text'>
        {textToString(information.payment?.total)}
      </div>
      {division.length > 0 && (
        <section className='mb-2'>
          <hr />
          <h2 className='my-2 text-center font-bold print-text'>
            División de la cuenta
          </h2>
          {division.map(({ diner, dishes, total: dinerTotal }) => (
            <table key={diner} className='mb-2 w-full print-text-small'>
              <thead>
                <tr>
                  <th scope='col' className='text-left'>
                    Comensal {diner}
                  </th>
                  <th scope='col' className='text-right'>
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupOrderDishes(dishes).map((dish) => (
                  <tr key={dish.key}>
                    <td>
                      {dish.number} × {dish.name}
                    </td>
                    <td className='text-right'>
                      {currencyFormat(dish.price * dish.number)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='font-bold'>
                  <td>Total del comensal</td>
                  <td className='text-right'>{currencyFormat(dinerTotal)}</td>
                </tr>
              </tfoot>
            </table>
          ))}
          {unassignedCents > 0 && (
            <p className='flex justify-between print-text-small'>
              <span>Sin asignar</span>
              <span>{currencyFormat(unassignedCents / 100)}</span>
            </p>
          )}
        </section>
      )}
      {showPaymentInfo && (
        <div className='flex flex-col'>
          <hr />
          <p className='font-bold text-center my-2 print-text'>
            INFORMACIÓN DE PAGO
          </p>
          <hr />
          <table>
            {showDiscount && (
              <>
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    (-)Descuento:
                  </td>
                  <td className='text-right print-text-small'>
                    -{currencyFormat(information?.payment?.discount || 0)}
                  </td>
                </tr>
                <tr>
                  <td className='font-bold text-left print-text-small'>
                    Total - Desc:
                  </td>
                  <td className='text-right print-text-small'>
                    {currencyFormat(
                      total - (information?.payment?.discount || 0),
                    )}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td className='font-bold text-left print-text-small'>
                (+)Propina:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.propina ?? 0)}
              </td>
            </tr>
            <tr>
              <td className='font-bold text-left print-text-small'>
                Gran Total:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.total ?? 0)}
              </td>
            </tr>
            <tr>
              <td className='font-bold text-left print-text-small'>
                Pago con:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.total_payed ?? 0)}
              </td>
            </tr>
            <tr>
              <td className='font-bold text-left print-text-small'>Cambio:</td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.cambio ?? 0)}
              </td>
            </tr>
          </table>
          <hr />
          <p className='font-bold text-center my-2 print-text'>
            DESGLOSE DE PAGOS
          </p>
          <hr />
          <table>
            <tr>
              <td className='font-bold text-left print-text-small'>
                Pago en efectivo:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.efective ?? 0)}
              </td>
            </tr>
            <tr>
              <td className='font-bold text-left print-text-small'>
                Pago tarjeta de credito:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.tdc ?? 0)}
              </td>
            </tr>
            <tr>
              <td className='font-bold text-left print-text-small'>
                Pago tarjeta de debito:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.tdd ?? 0)}
              </td>
            </tr>
            <tr>
              <td className='font-bold text-left print-text-small'>
                Pago vales:
              </td>
              <td className='text-right print-text-small'>
                {currencyFormat(information?.payment?.vales ?? 0)}
              </td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
});
