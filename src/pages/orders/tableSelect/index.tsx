import { setTableOrder } from "@/store/slices/orders.slice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function tableSelector() {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleNavigation = (table: number) => {
    dispatch(setTableOrder(table));
    router.push("/orders/typeSelect/");
  };
  return (
    <>
      <div className='grid'>
        <p className='h-10 text-2xl font-medium p-10'>Seleccione una mesa</p>
        <div className='flex justify-around px-10'>
          <div className='p-3'>
            <button
              onClick={() => handleNavigation(1)}
              className='bg-neutral-400 text-2xl w-[200px] h-[200px]'
            >
              Mesa 1
            </button>
          </div>
          <div className='p-3'>
            <button
              onClick={() => handleNavigation(2)}
              className='bg-neutral-400 text-2xl w-[200px] h-[200px]'
            >
              Mesa 2
            </button>
          </div>
          <div className='p-3'>
            <button
              onClick={() => handleNavigation(3)}
              className='bg-neutral-400 text-2xl w-[200px] h-[200px]'
            >
              Mesa 3
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
