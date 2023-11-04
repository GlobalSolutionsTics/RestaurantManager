import { useRouter } from "next/router";

export default function tableSelector() {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/orders/typeSelect/");
  };
  return (
    <>
      <div className='grid'>
        <p className='h-10 text-2xl font-medium p-10'>Seleccione una mesa</p>
        <div className='flex justify-around px-10'>
          <div className='p-3'>
            <button
              onClick={handleNavigation}
              className='bg-neutral-400 text-2xl w-[200px] h-[200px]'
            >
              Mesa 1
            </button>
          </div>
          <div className='p-3'>
            <button className='bg-neutral-400 text-2xl w-[200px] h-[200px]'>
              Mesa 2
            </button>
          </div>
          <div className='p-3'>
            <button className='bg-neutral-400 text-2xl w-[200px] h-[200px]'>
              Mesa 3
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
