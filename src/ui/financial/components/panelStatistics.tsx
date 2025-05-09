import { currencyFormat } from "@/utils/formats";
import { FinancialResponse } from "../type";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";

type Props = {
  list: FinancialResponse[];
};

const PanelStatisticsFinancial = ({ list }: Props) => {
  const [total, setTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTravel, setTotalTravel] = useState(0);
  const [tablesAttended, setTablesAttended] = useState(0);
  const [dishesAttended, setDishesAttended] = useState(0);
  const [averageTab, setAverageTab] = useState(0);
  const [averageDishesTable, setAverageDishesTable] = useState(0);
  const [salesForTravel, setSalesForTravel] = useState(0);

  const getTotal = () => {
    let totalList = 0;
    let totalDiscount = 0;
    let tablesAttended = 0;
    let toTravel = 0;
    let totalDishesAttended = 0;
    let totalSalesForTravel = 0;
    let totalDishesAttendedInTable = 0;
    let totalSalesAttendedInTable = 0;
    list.map((itm) => {
      if (itm?.data?.length > 0) {
        itm.data.map((order) => {
          let discount = 0;
          const parserDiscount = parseFloat(order.discount ?? 0);
          if (!isNaN(parserDiscount)) discount = parserDiscount;
          order.tableNumber !== DEFAULT_TABLE_LLEVAR
            ? tablesAttended++
            : toTravel++;

          //Obtener platillos atendidos
          order.dishesDescription.map((dish) => {
            if (dish.number !== 0) totalDishesAttended++;
          });
          order.dishesDescription.map((dish) => {
            const isInHouse =
              dish.number !== 0 && order.tableNumber !== DEFAULT_TABLE_LLEVAR;
            if (isInHouse) {
              totalDishesAttendedInTable++;
            }
          });

          if (order.tableNumber !== DEFAULT_TABLE_LLEVAR)
            totalSalesAttendedInTable += order.total - discount;

          if (order.tableNumber === DEFAULT_TABLE_LLEVAR)
            totalSalesForTravel +=
              order.total + parseFloat(order.propine ?? 0) - discount;
          totalDiscount += discount;
          totalList += order.total - discount;
        });
      }
    });
    setTotalDiscount(totalDiscount);
    setTotal(totalList);
    setTablesAttended(tablesAttended);
    setTotalTravel(toTravel);
    setDishesAttended(totalDishesAttended);
    setSalesForTravel(totalSalesForTravel);
    setAverageDishesTable(
      Math.round(totalDishesAttendedInTable / tablesAttended),
    );
    setAverageTab(Math.floor(totalSalesAttendedInTable / tablesAttended));
  };

  const init = useCallback(() => {
    getTotal();
  }, [list]);

  useEffect(() => {
    init();
  }, [list]);

  return (
    <div className='flex flex-col'>
      <div className='!bg-blue-dark !text-white p-2'>
        Estadisticas del periodo
      </div>
      <div className='bg-enabled-light grid grid-cols-2 gap-2 px-2 py-1 rounded-lg text-[0.85rem]'>
        <p>Total vendido: {currencyFormat(total)}</p>
        <p>Total de descuentos aplicados: {currencyFormat(totalDiscount)}</p>
        <p>Total de platillos expedidos: {dishesAttended}</p>
        <p>Venta promedio por mesa: {currencyFormat(averageTab)}</p>
        <p>Platillos promedio por mesa: {averageDishesTable}</p>
        <p>Mesas atendidas: {tablesAttended}</p>
        <p>
          Ventas por delivary (para llevar): {currencyFormat(salesForTravel)}
        </p>
        <p>Pedidos para llevar: {totalTravel}</p>
      </div>
    </div>
  );
};

export default PanelStatisticsFinancial;
