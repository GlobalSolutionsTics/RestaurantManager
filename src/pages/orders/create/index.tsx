import ProtectPage from "@/pages/admin/components/protectPage";
import { resetComanda } from "@/store/slices/orders.slice";
import { IUserRedux } from "@/store/slices/user.slice";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS, TOKEN } from "@/utils/users";
import {
  AddOutlined,
  GridView,
  ListAltOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function createIndex() {
  const personStore: IUserRedux = useSelector((store: any) => store.user);
  const router = useRouter();

  const dispatch = useDispatch();

  const handleOrderNavigate = () => {
    router.push("/orders/myOrders");
  };

  const handleNavigation = () => {
    router.push("/orders/tableSelect");
  };

  const handleApplicationNavigation = () => {
    router.push("/orders/myApplications");
  };

  const handleClose = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    sessionStorage.removeItem(TOKEN_ID);
    router.push("/admin");
  }, []);

  //Initializer
  const init = useCallback(() => {
    dispatch(resetComanda());
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <div className='flex flex-row justify-between w-full p-4'>
        <div className='text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-primary basis-3/4'>
          {personStore.name}
        </div>
        <div className='flex justify-end basis-1/4'>
          <button onClick={handleClose}>
            <PowerSettingsNew />
          </button>
        </div>
      </div>
      <div className='h-[calc(100vh_-_92px)] w-full'>
        <div className='m-auto flex flex-col items-center w-full p-4 md:p-6 lg:p-8'>
          <div className='relative bg-whites'>
            <div className='h-[150px] w-[150px] rounded-full'>
              <Image
                src='/media/profile.png'
                width={150}
                height={150}
                alt='profile'
              />
            </div>
            <div className='absolute bottom-3 right-0 w-[45px] h-[45px] bg-white rounded-full'>
              <Image
                src='/media/bell.png'
                alt='campana'
                width={45}
                height={45}
              />
            </div>
            <div className='absolute bottom-1 -right-3 w-[30px] h-[30px] bg-danger text-white flex flex-col justify-center items-center rounded-full'>
              12
            </div>
          </div>
          <div className='py-4 w-full'>
            <button
              onClick={handleOrderNavigate}
              className='disabled:bg-neutral-400 w-full h-[80px] font-primary text-[2rem] bg-blue text-white'
            >
              <ListAltOutlined /> Mis ordenes
            </button>
          </div>
          <div className='py-4 w-full'>
            <button
              onClick={handleNavigation}
              className='bg-neutral-400 w-full h-[80px] font-primary text-[2rem] bg-success-dark hover:bg-success text-white'
            >
              <AddOutlined /> Nueva Orden
            </button>
          </div>
          <hr className='border-2 my-4' />
          <div className='text-small font-primary'>V {process.env.version}</div>
        </div>
      </div>
    </ProtectPage>
  );
}
