import { currencyFormat } from "@/utils/formats";
import { FinancialResponse, TableSalesDishes } from "../type";
import { useCallback, useEffect, useState } from "react";

type Props = {
  list: FinancialResponse[];
};

export const TableSalesForDishes = ({ list }: Props) => {
  const [map, setMap] = useState<TableSalesDishes[]>([]);

  const initTable = useCallback(() => {
    const listOfDishes: TableSalesDishes[] = [];
    list.forEach((itm) => {
      if (itm?.data?.length > 0) {
        itm.data.map((order) => {
          order.dishesDescription.map((dish) => {
            const index = listOfDishes.findIndex((ls) => ls.uuid === dish.uuid);
            const units = dish.number !== "" ? (dish.number as number) : 0;
            const body: TableSalesDishes = {
              uuid: dish.uuid,
              name: dish.name,
              price: dish.price,
              units: units,
              total: dish.price * units,
            };
            if (index === -1) {
              listOfDishes.push(body);
            } else {
              listOfDishes[index].units =
                listOfDishes[index].units + body.units;
              listOfDishes[index].total =
                listOfDishes[index].total + body.total;
            }
          });
        });
      }
    });
    setMap(listOfDishes);
  }, [list]);
  useEffect(() => {
    initTable();
  }, [list]);

  return (
    <div className='w-full basis-1/2'>
      <div className='w-full flex flex-row bg-enabled-dark p-2'>
        Platillos que más vendieron
      </div>
      <div className='w-full flex flex-row p-2'>
        <div className='basis-1/4 text-center'>Platillo</div>
        <div className='basis-1/4 text-center'>Unidades</div>
        <div className='basis-1/4 text-center'>Precio unit</div>
        <div className='basis-1/4 text-center'>Venta total</div>
      </div>
      <div className='flex flex-col [&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white overflow-y-auto max-h-[400px]'>
        {map.length > 0 &&
          map
            .sort((a, b) => b.units - a.units)
            .map((itm) => (
              <div key={itm.uuid} className='w-full flex flex-row p-2'>
                <div className='basis-1/4 text-center'>{itm.name}</div>
                <div className='basis-1/4 text-center'>{itm.units}</div>
                <div className='basis-1/4 text-center'>
                  {currencyFormat(itm.price)}
                </div>
                <div className='basis-1/4 text-center'>
                  {currencyFormat(itm.total)}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
