import {
  IOrderSlice,
  reset as resetOrderRedux,
} from "@/store/slices/orders.slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import Joyride from "react-joyride";
import { useState } from "react";

const QrCodePage = () => {
  const { push } = useRouter();
  const orderStore: IOrderSlice = useSelector(
    (store: any) => store.ordersDishes,
  );
  const dispatch = useDispatch();

  const url = `${process.env.NEXT_PUBLIC_URL_SERVICES}checks/${orderStore.id}`;

  const handleFinishOrder = () => {
    dispatch(resetOrderRedux());
    push("/orders/create");
  };

  const [{ run, steps }, setState] = useState<{ run: boolean; steps: any }>({
    run: true,
    steps: [
      {
        content: (
          <h2 className='text-2xl'>
            En esta ventana podremos encontrar un codigo QR que el cliente podrá
            ecanear para seguir en tiempo real su pedido.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: (
          <h2 className='text-2xl'>
            Al terminar presionamos el botón "finalizar".
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#first-step",
        title: "Tipos de platillos",
      },
    ],
  });

  return (
    <div className='flex flex-col h-[100vh] w-full'>
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
      <div className='font-primary text-[1.5rem] font-bold px-4 py-4'>
        Escaneé el siguiente QR para verificar el estado de su orden
      </div>
      <div className='flex flex-col justify-center items-center p-8 h-[80vh]'>
        <QRCode size={350} value={url} />
      </div>
      <div className='p-4'>
        <p className='text-secondary font-bold text-[1.5rem]'>
          En caso de error entre al siguiente link:
        </p>
        <Link className='text-secondary text-blue text-[1.5rem]' href={url}>
          {url}
        </Link>
      </div>
      <button
        onClick={handleFinishOrder}
        className='w-full text-[2rem] font-primary font-bold bg-success text-white p-4'
        id='first-step'
      >
        Finalizar
      </button>
    </div>
  );
};

export default QrCodePage;
