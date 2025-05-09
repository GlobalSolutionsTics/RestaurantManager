import { currencyFormat } from "@/utils/formats";
import { FinancialResponse, TableSales } from "../type";
import { useCallback, useEffect, useState } from "react";

type Props = {
  list: FinancialResponse[];
};

export const TableSalesForDays = ({ list }: Props) => {
  const [map, setMap] = useState<TableSales[]>([]);
  const getDay = (val: number) => {
    switch (val) {
      case 0:
        return "Domingo";
      case 1:
        return "Lunes";
      case 2:
        return "Martes";
      case 3:
        return "Miercoles";
      case 4:
        return "Jueves";
      case 5:
        return "Viernes";
      case 6:
        return "Sabado";
    }
  };

  const initTable = useCallback(() => {
    const listOfDays: TableSales[] = [];
    list.forEach((itm) => {
      if (itm?.data?.length > 0) {
        const index = listOfDays.findIndex(
          (ls) => ls.day === itm.data?.[0]?.createAtDay,
        );
        const body = {
          day: itm.data?.[0]?.createAtDay,
          total: itm.data.reduce((acc, curr) => {
            let disc = 0;
            const discount = parseFloat(curr.discount ?? 0);
            if (!isNaN(discount)) disc = discount;
            return acc + (curr.total + parseFloat(curr.propine ?? 0) - disc);
          }, 0),
        };
        if (index === -1) {
          listOfDays.push(body);
        } else {
          listOfDays[index].total = listOfDays[index].total + body.total;
        }
      }
    });
    setMap(listOfDays);
  }, [list]);
  useEffect(() => {
    initTable();
  }, [list]);

  return (
    <div className='w-full'>
      <div className='w-full flex flex-row bg-enabled-dark p-2'>
        Ventas por dia de la semana
      </div>
      <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto max-h-[400px]'>
        {map.length > 0 &&
          map
            .sort((a, b) => a.day - b.day)
            .map((itm) => (
              <div className='w-full flex flex-row p-2'>
                <div className='basis-1/2'>{getDay(Number(itm.day))}</div>
                <div className='basis-1/2'>{currencyFormat(itm.total)}</div>
              </div>
            ))}
      </div>
    </div>
  );
};
