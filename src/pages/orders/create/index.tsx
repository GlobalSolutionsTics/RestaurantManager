import { useRouter } from "next/router";

export default function createIndex() {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/orders/tableSelect");
  };
  return (
    <>
      <div className='grid h-screen'>
        <div className='m-auto grid p-10'>
          <div className='py-6'>
            <button className='bg-neutral-400 w-[720px] h-[80px]'>
              Mis ordenes
            </button>
          </div>
          <div className='py-6'>
            <button
              onClick={handleNavigation}
              className='bg-neutral-400 w-[720px] h-[80px]'
            >
              Nueva Orden
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
