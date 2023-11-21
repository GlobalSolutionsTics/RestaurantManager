import { createOrder } from "@/services/order";
import { IOrderSlice } from "@/store/slices/orders.slice";
import Image from "next/image";
import { useSelector } from "react-redux";

const FinishOrderPage = () => {
  const orderStore: IOrderSlice = useSelector(
    (store: any) => store.ordersDishes,
  );
  const handleSendOrder = async () => {
    const payload = {
      name: orderStore.name,
      dishes: orderStore.dishes,
      tableNumber: orderStore.tableNumber,
      dishesDescription: orderStore.dishesDescription,
    };
    const create = await createOrder(payload);
    if (create) {
      console.log("Creado!");
    } else {
      console.log("Con fallas");
    }
  };
  return (
    <>
      <div className='w-full h-[100vh]'>
        <div className='bg-white top-0'>
          <div className='relative font-normal h-[120px] grid content-center w-screen px-10 bg-neutral-300'>
            <Image src={"/platillos/otros.jpg"} fill alt='' />
            <div className='absolute opacity-60 bg-black top-0 bottom-0 w-full'></div>
            <div className='absolute w-full top-0 bottom-0 flex flex-col py-4 px-6'>
              <p className='text-5xl text-white font-secondary'>
                Finalizar orden
              </p>
              <p className='text-3xl text-white font-primary'>
                Numero de platillos en la orden: {orderStore.dishes}
              </p>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex flex-col flex-start mx-8 my-4'>
            <span className='text-primary text-[2rem] mb-2'>
              ¿Cuantos platillos van en la orden?
            </span>
            {orderStore.dishesDescription.map((itm) => (
              <div className='w-full my-4 bg-enabled py-4 px-2'>
                <span className='text-secondary text-[1.5rem]'>{itm.name}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className='text-[2rem] p-4 text-center w-full bg-success fixed bottom-0 text-white font-primary font-bold'
          onClick={handleSendOrder}
        >
          Enviar orden
        </button>
      </div>
    </>
  );
};

export default FinishOrderPage;
