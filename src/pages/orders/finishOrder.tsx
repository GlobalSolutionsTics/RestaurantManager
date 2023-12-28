import { createOrder } from "@/services/order";
import { IOrderSlice, setOrderIdRedux } from "@/store/slices/orders.slice";
import { TextField, TextareaAutosize } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FinishOrderPage = () => {
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();
  const orderStore: IOrderSlice = useSelector(
    (store: any) => store.ordersDishes,
  );
  const dispatch = useDispatch();
  const userStore = useSelector((store: any) => store.user);

  const handleSendOrder = async () => {
    setLoading(true);
    const payload = {
      name: orderStore.name,
      dishes: orderStore.dishes,
      tableNumber: orderStore.tableNumber,
      dishesDescription: orderStore.dishesDescription,
      waiter: userStore.uuid,
    };
    const create = await createOrder(payload);
    if (create) {
      dispatch(setOrderIdRedux(create));
      push("/orders/qrcodePage");
    } else {
      console.log("Con fallas");
    }
    setLoading(false);
  };
  return (
    <>
      <div className='w-full h-[100vh]'>
        <div className='bg-white top-0'>
          <div className='relative font-normal h-[120px] grid content-center w-screen px-10 bg-neutral-300'>
            <Image src={"/platillos/otros.jpg"} fill alt='' />
            <div className='absolute opacity-60 bg-black top-0 bottom-0 w-full'></div>
            <div className='absolute w-full top-0 bottom-0 flex flex-col py-4 px-6'>
              <p className='text-[2rem] text-white font-secondary'>
                Finalizar orden
              </p>
              <p className='text-[1.5rem] text-white font-primary'>
                Numero de platillos en la orden: {orderStore.dishes}
              </p>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex flex-col flex-start mx-8 my-4'>
            <span className='font-primary text-[1.5rem] mb-2'>
              ¿Cuantos platillos van en la orden?
            </span>
            <div className='flex flex-col'>
              {orderStore.dishesDescription.map((itm) => (
                <div className='w-full flex justify-between bg-enabled py-2 px-2'>
                  <div className='text-secondary text-[1rem]'>{itm.name}</div>
                  <div>{itm.number}</div>
                </div>
              ))}
            </div>
            <TextField
              id='anotations-textarea'
              title='Anotaciones'
              placeholder='Anotaciones'
              label='Anotaciones'
              maxRows={4}
              variant='filled'
            />
          </div>
        </div>
        {loading ? (
          <div className='flex items-center fixed bottom-0 p-4 text-[1.5rem]'>
            <span className='loader mr-4'></span> Enviando orden
          </div>
        ) : (
          <button
            className='text-[2rem] p-4 text-center w-full bg-success disabled:!bg-enabled disabled:!text-dark fixed bottom-0 text-white font-primary font-bold'
            onClick={handleSendOrder}
            disabled={orderStore.dishesDescription.length === 0}
          >
            Enviar orden
          </button>
        )}
      </div>
    </>
  );
};

export default FinishOrderPage;
