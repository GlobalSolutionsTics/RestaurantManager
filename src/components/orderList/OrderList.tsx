import React, { FC, useEffect, useState } from "react";
import { SectionProps } from "../types/section.type";
import { useRouter } from "next/router";

interface OrderListProps {
  order: string;
}

const OrderList: FC<OrderListProps> = ({ order }) => {
  const [orderContent, setOrderContent] = useState();

  useEffect(() => {
    setOrderContent(order);
  }, [order]);

  //console.log(orderContent);
  return (
    <section className='grid'>
      <div className='m-auto my-5'>
        <p className='text-2xl'>¿Cuantos platillos va a ordenar?</p>
        <div>
          <div className='flex'>
            <p className='flex justify-center items-center basis-1/2 text-4xl h-14 my-3'>
              {orderContent}
            </p>
            <p className='flex justify-center items-center basis-1/2 text-4xl h-14 bg-neutral-300 my-3'>
              2
            </p>
          </div>
          <div>
            <p className='text-2xl my-3'>Notas sobre la orden</p>
            <div className='my-3'>
              <input
                className='w-[672px] h-[472px] bg-neutral-300'
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
