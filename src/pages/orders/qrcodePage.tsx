import { resetCreateCommanda } from "@/store/slices/create.order.slice";
import {
  IOrderSlice,
  resetComanda as resetOrderRedux,
} from "@/store/slices/orders.slice";
import { RootRedux } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
const QrCodePage = () => {
  const { push } = useRouter();
  const orderStore = useSelector((store: RootRedux) => store.orderCreate);
  const dispatch = useDispatch();

  const url = `${process.env.NEXT_PUBLIC_URL_SERVICES}checks/${orderStore.id}`;

  const handleFinishOrder = () => {
    dispatch(resetCreateCommanda());
    push("/orders/create");
  };

  return (
    <div className='flex flex-col h-[100vh] w-full'>
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
      >
        Finalizar
      </button>
    </div>
  );
};

export default QrCodePage;
