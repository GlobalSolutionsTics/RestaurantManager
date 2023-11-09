import Dishes from "@/components/dishes/Dishes";
import OrderList from "@/components/orderList/OrderList";
import { getDishService } from "@/services/dishes";
import { TMenuResponse } from "@/types/menu.types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function typeSelector() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Array<TMenuResponse>>([]);
  const { id } = router.query;
  const [orderNext, setOrderNext] = useState(true);
  const [order, setOrder] = useState<string>("");

  const obtainDishes = useCallback(async () => {
    const obtainDishes = await getDishService(`${id}`);
    if (obtainDishes) {
      setDishes(obtainDishes);
    }
  }, []);

  useEffect(() => {
    obtainDishes();
  }, []);

  let title = "";
  for (let i = 0; i < id.length; i++) {
    if (id[i] === "_") {
      title += " ";
    } else {
      title += id[i];
    }
  }

  let orderStat = "";
  const handleOrder = () => {
    setOrderNext(!orderNext);
  };
  if (orderNext === false) {
    orderStat = `Seleccione un tipo de ${title}`;
  } else {
    orderStat = "Termine la orden para este platillo";
  }

  return (
    <>
      <div>
        <div className='font-normal h-[120px] grid content-center w-screen px-10 bg-neutral-300'>
          <p className='text-5xl '>{title.toUpperCase()}</p>
          <p className='text-3xl'>{orderStat}</p>
        </div>
        <div className='flex content-center items-center flex-wrap justify-center'>
          {dishes?.map((dish) => (
            <div>
              <Dishes
                key={dish.uuid}
                title={`${dish.name}`}
                description={`${dish.price}`}
                content=''
                className='h-[200px] w-[200px] bg-neutral-300 text-2xl'
                order=''
                setOrder={setOrder}
              />
            </div>
          ))}
        </div>
        <div>
          <OrderList order={order} />
        </div>
        <div className='grid'>
          <div className='m-auto'>
            <button
              onClick={handleOrder}
              className='m-2 w-[668px] h-[64px] bg-neutral-300 text-3xl'
            >
              Siguiente
            </button>
          </div>
          <div className='m-auto'>
            <button className='m-2 w-[668px] h-[64px] bg-neutral-300 text-3xl'>
              Regresar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
