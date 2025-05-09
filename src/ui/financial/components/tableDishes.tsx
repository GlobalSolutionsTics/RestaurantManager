import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat } from "@/utils/formats";
import { FinancialResponse, Order } from "../type";

type Props = {
  list: FinancialResponse[];
  onCheck: Function;
};
const TableDishes = ({ list, onCheck }: Props) => {
  const handleCheck = (data: Order) => {
    return onCheck(data);
  };
  return (
    <div>
      <div className='w-full flex flex-row bg-enabled-dark p-2'>
        <div className='basis-1/6'>Fecha</div>
        <div className='basis-1/6'>Mesa</div>
        <div className='basis-1/6'>Platillos</div>
        <div className='basis-1/6'>Total</div>
        <div className='basis-1/6'>Descuento</div>
        <div className='basis-1/6'>Propina</div>
      </div>
      <div className='flex flex-col overflow-y-auto max-h-[400px]'>
        {list.length > 0 &&
          list.map((itm) => (
            <div className='w-full flex flex-col'>
              {itm?.data?.length > 0 && (
                <p className='sticky top-0 p-2 bg-white'>{itm.date}</p>
              )}

              <div className='[&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white'>
                {itm?.data?.map((dish) => {
                  let disc = 0;
                  const discount = parseFloat(dish.discount ?? 0);
                  if (!isNaN(discount)) disc = discount;
                  return (
                    <div
                      className='w-full flex flex-row p-2 hover:cursor'
                      onClick={() => handleCheck(dish)}
                    >
                      <div className='basis-1/6'>{dish.createdAtTmp}</div>
                      <div className='basis-1/6'>
                        {dish.tableNumber === DEFAULT_TABLE_LLEVAR
                          ? "PARA LLEVAR"
                          : "MESA " + dish.tableNumber}
                      </div>
                      <div className='basis-1/6'>
                        {dish.dishesDescription.length}
                      </div>
                      <div className='basis-1/6'>
                        {currencyFormat(
                          dish.total + parseFloat(dish.propine ?? 0) - disc,
                        )}
                      </div>
                      <div className='basis-1/6'>{currencyFormat(disc)}</div>
                      <div className='basis-1/6'>
                        {currencyFormat(parseFloat(dish.propine ?? 0))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TableDishes;
