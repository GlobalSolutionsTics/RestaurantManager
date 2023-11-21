import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "@/store/slices/counterSlice";

interface OrderListProps {
  order: string;
}

const OrderList: FC<OrderListProps> = ({ order }) => {
  const [orderContent, setOrderContent] = useState<string[]>([""]);

  const dispatch = useDispatch();
  const counter = useSelector((state: any) => state.counter.value);

  return (
    <section className='grid'>
      <div className='m-auto my-5'>
        <p className='text-2xl'>¿Cuantos platillos va a ordenar?</p>
        <div>
          <div className='flex'>
            <p className='flex justify-center items-center basis-1/2 text-4xl h-14 my-3'>
              {orderContent.map((x, index) => (
                <span key={index}>{x}</span>
              ))}
            </p>
            <div>
              <button onClick={() => dispatch(increment())}>+</button>
              <p>{counter}</p>
              <button onClick={() => dispatch(decrement())}>-</button>
            </div>
          </div>
          <div>
            <p className='text-2xl my-3'>Notas sobre la orden</p>
            <div className='my-3'>
              <input
                className=' w-[672px] h-[472px] bg-neutral-300'
                type='text'
              />
            </div>
            <div className='my-3'>
              <p className='text-2xl'>Costo total</p>
              <p className='text-2xl'>$580</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderList;
