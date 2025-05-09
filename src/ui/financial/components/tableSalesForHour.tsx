import { currencyFormat } from "@/utils/formats";
import { FinancialResponse, TableSalesHour } from "../type";
import { useCallback, useEffect, useState } from "react";

type Props = {
  list: FinancialResponse[];
};

export const TableSalesForHour = ({ list }: Props) => {
  const [map, setMap] = useState<TableSalesHour[]>([]);

  const initTable = useCallback(() => {
    const listOfHours: TableSalesHour[] = [];
    list.forEach((itm) => {
      if (itm?.data?.length > 0) {
        itm.data.map((order) => {
          const index = listOfHours.findIndex(
            (ls) => ls.hour === order.createAtHour,
          );
          let disc = 0;
          const discount = parseFloat(order.discount ?? 0);
          if (!isNaN(discount)) disc = discount;
          const body = {
            hour: order.createAtHour,
            total: order.total + parseFloat(order.propine ?? 0) - disc,
          };
          if (index === -1) {
            listOfHours.push(body);
          } else {
            listOfHours[index].total = listOfHours[index].total + body.total;
          }
        });
      }
    });
    setMap(listOfHours);
  }, [list]);
  useEffect(() => {
    initTable();
  }, [list]);

  return (
    <div className='w-full'>
      <div className='w-full flex flex-row bg-enabled-dark p-2'>
        Ventas por hora del día
      </div>
      <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto max-h-[400px]'>
        {map.length > 0 &&
          map
            .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
            .map((itm) => (
              <div className='w-full flex flex-row p-2'>
                <div className='basis-1/2'>{parseInt(itm.hour) + 6}</div>
                <div className='basis-1/2'>{currencyFormat(itm.total)}</div>
              </div>
            ))}
      </div>
    </div>
  );
};
