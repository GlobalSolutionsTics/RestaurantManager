import ProtectPage from "@/pages/admin/components/protectPage";
import { listConfigurationService } from "@/services/config";
import { setTableOrder } from "@/store/slices/orders.slice";
import { TConifg } from "@/types/configuration.types";
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
    const token = sessionStorage.getItem("rest-token");
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
      <div className='w-full p-8'>
        <p className='h-10 font-medium font-primary font-bold text-[1.5rem]'>
          ¿Que mesa atenderá?
        </p>
        {loading ? (
          <div className='flex items-center'>
            <span className='loader mr-4'></span> Cargando información del
            configurador
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 overflow-y-auto'>
            {kitchen.map((itm, index) => (
              <div key={index}>
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
    </ProtectPage>
  );
}
