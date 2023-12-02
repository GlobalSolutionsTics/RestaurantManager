import ProtectPage from "@/pages/admin/components/protectPage";
import { IUserRedux } from "@/store/slices/user.slice";
import {
  AddOutlined,
  ListAltOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function createIndex() {
  const personStore: IUserRedux = useSelector((store: any) => store.user);
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/orders/tableSelect");
  };

  return (
    <ProtectPage push={router.push}>
      <div className='flex flex-row justify-between w-full p-4'>
        <div className='text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] basis-3/4'>
          {personStore.name}
        </div>
        <div className='flex justify-end basis-1/4'>
          <button>
            <PowerSettingsNew />
          </button>
        </div>
      </div>
      <div className='grid h-screen w-full'>
        <div className='m-auto flex flex-col items-center w-full p-4 md:p-6 lg:p-8'>
          <div className='py-6 w-full'>
            <button className='bg-neutral-400 w-full h-[80px] font-primary text-[2rem] bg-blue text-white'>
              <ListAltOutlined /> Mis ordenes
            </button>
          </div>
          <div className='py-6 w-full'>
            <button
              onClick={handleNavigation}
              className='bg-neutral-400 w-full h-[80px] font-primary text-[2rem] bg-success-dark hover:bg-success text-white'
            >
              <AddOutlined /> Nueva Orden
            </button>
          </div>
        </div>
      </div>
    </ProtectPage>
  );
}
