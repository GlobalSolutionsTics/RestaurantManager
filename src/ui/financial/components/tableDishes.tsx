import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat, getFloat } from "@/utils/formats";
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
            <div key={itm.date} className='w-full flex flex-col'>
              {itm?.data?.length > 0 && (
                <p className='sticky top-0 p-2 bg-white'>{itm.date}</p>
              )}

              <div className='[&>*]:bg-enabled [&>*:nth-child(odd)]:!bg-blue-dark [&>*:nth-child(odd)]:!text-white'>
                {itm?.data?.map((dish) => {
                  const discount = getFloat(dish.discount);
                  const propine = getFloat(dish.propine);
                  return (
                    <div
                      key={dish.uuid}
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
                        {currencyFormat(dish.total + propine - discount)}
                      </div>
                      <div className='basis-1/6'>
                        {currencyFormat(discount)}
                      </div>
                      <div className='basis-1/6'>{currencyFormat(propine)}</div>
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
