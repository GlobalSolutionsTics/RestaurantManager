import { createOrder } from "@/services/order";
import { IOrderSlice, setOrderIdRedux } from "@/store/slices/orders.slice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joyride from "react-joyride";

const FinishOrderPage = () => {
  const [loading, setLoading] = useState(false);
  const [tour, setTour] = useState(false);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any>([]);

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

  const handleTour = useCallback(() => {
    setTour(true);
  }, []);

  useEffect(() => {
    const joyrideSteps = [
      {
        content: (
          <h2 className='text-2xl'>
            En esta ventana podremos encontrar los platillos que se van a
            ordenar para poder confirmarla.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: <h2 className='text-2xl'>Aquí encontramos los platillos.</h2>,
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#first-step",
        title: "Tipos de platillos",
      },
      {
        content: (
          <h2 className='text-2xl'>
            Al terminar de confirmar la orden, presionamos el boton "Enviar
            orden".
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#second-step",
        title: "Mis ordenes",
      },
    ];

    setRun(tour);
    setSteps(joyrideSteps);
  }, [tour]);

  return (
    <>
      <Joyride
        continuous
        callback={() => {}}
        run={run}
        steps={steps}
        scrollToFirstStep
        hideCloseButton
        showSkipButton
        showProgress
      />
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
            <span className='font-primary text-[2rem] mb-2'>
              ¿Cuantos platillos van en la orden?
            </span>
            <button
              className='bg-red-800 text-white w-20 h-8 rounded mx-2 my-2'
              onClick={handleTour}
            >
              Tutorial
            </button>
            <div id='first-step'>
              {orderStore.dishesDescription.map((itm) => (
                <div className='w-full flex justify-between my-4 bg-enabled py-4 px-2'>
                  <div className='text-secondary text-[1.5rem]'>{itm.name}</div>
                  <div>{itm.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex items-center fixed bottom-0 p-4 text-[1.5rem]'>
            <span className='loader mr-4'></span> Enviando orden
          </div>
        ) : (
          <button
            className='text-[2rem] p-4 text-center w-full bg-success fixed bottom-0 text-white font-primary font-bold'
            onClick={handleSendOrder}
            id='second-step'
          >
            Enviar orden
          </button>
        )}
      </div>
    </>
  );
};

export default FinishOrderPage;
