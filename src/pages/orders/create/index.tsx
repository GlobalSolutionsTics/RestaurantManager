import { AddOutlined, ListAltOutlined } from "@mui/icons-material";
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
            <button className='bg-neutral-400 w-[720px] h-[80px] font-primary text-[2rem] bg-blue text-white'>
              <ListAltOutlined /> Mis ordenes
            </button>
          </div>
          <div className='py-6'>
            <button
              onClick={handleNavigation}
              className='bg-neutral-400 w-[720px] h-[80px] font-primary text-[2rem] bg-success-dark hover:bg-success text-white'
            >
              <AddOutlined /> Nueva Orden
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
