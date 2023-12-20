import ProtectPage from "@/pages/admin/components/protectPage";
import { listConfigurationService } from "@/services/config";
import { setTableOrder } from "@/store/slices/orders.slice";
import { TConifg } from "@/types/configuration.types";
import { TOKEN_ID } from "@/utils/strings";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function tableSelector() {
  const [loading, setLoading] = useState(false);
  const [kitchen, setKitchen] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const handleNavigation = (table: number) => {
    dispatch(setTableOrder(table));
    router.push("/orders/typeSelect/");
  };

  //Area para los servicios
  const getConfigurationInfo = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      const petition: TConifg = await listConfigurationService(token);
      const list: any = new Array(petition.tablesActives).fill(0);
      setKitchen(list);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  //Cargas iniciales
  useEffect(() => {
    getConfigurationInfo();
  }, []);

  return (
    <ProtectPage push={router.push}>
      <div className='relative'>
        <p className='text-[2rem] bg-neutral-300 font-primary h-[120px] grid content-center px-10 w-screen'>
          ¿Que mesa atenderá?
        </p>
        <div className='p-8 grid'>
          {loading ? (
            <div className='flex items-center'>
              <span className='loader mr-4'></span> Cargando información del
              configurador
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 overflow-y-auto'>
              {kitchen.map((itm, index) => (
                <div key={index} className='grid justify-items-center'>
                  <button
                    onClick={() => handleNavigation(Number(index + 1))}
                    className='bg-neutral-400 text-2xl font-secondary w-[150px] h-[150px]'
                  >
                    Mesa {index + 1}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectPage>
  );
}
