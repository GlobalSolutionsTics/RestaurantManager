import { useCallback, useEffect, useState } from "react";
import { FinancialResponse, TableWaiter } from "../type";
import { currencyFormat, getFloat } from "@/utils/formats";
import WaiterName from "@/components/waiter/WaiterName";

type Props = {
  list: FinancialResponse[];
};

export const TableSalesForWaiter = ({ list }: Props) => {
  const [map, setMap] = useState<TableWaiter[]>([]);

  const initTable = useCallback(() => {
    const listOfDishes: TableWaiter[] = [];
    list.forEach((itm) => {
      if (itm?.data?.length > 0) {
        itm.data.map((order) => {
          const index = listOfDishes.findIndex(
            (ls) => ls.uuid === order.waiter,
          );
          const discount = getFloat(order.discount);
          const propine = getFloat(order.propine);
          const body: TableWaiter = {
            uuid: order.waiter,
            name: "",
            propine: propine,
            total: order.total + propine - discount,
          };
          if (index === -1) {
            listOfDishes.push(body);
          } else {
            listOfDishes[index].propine =
              listOfDishes[index].propine + body.propine;
            listOfDishes[index].total = listOfDishes[index].total + body.total;
          }
        });
      }
    });
    setMap(listOfDishes);
  }, [list]);
  useEffect(() => {
    initTable();
  }, [list]);
  return (
    <div>
      <div className='w-full flex flex-row bg-enabled-dark p-2'>
        Venta por mesero
      </div>
      <table className='w-full'>
        <thead>
          <tr>
            <th>Mesero</th>
            <th>Venta</th>
            <th>Propinas recibidas</th>
          </tr>
        </thead>
        <tbody className='[&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white'>
          {map.map((itm) => (
            <tr key={itm.uuid}>
              <td className='p-2'>
                <WaiterName waiterId={itm.uuid} />
              </td>
              <td className='p-2 text-center'>{currencyFormat(itm.total)}</td>
              <td className='p-2 text-center'>{currencyFormat(itm.propine)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
