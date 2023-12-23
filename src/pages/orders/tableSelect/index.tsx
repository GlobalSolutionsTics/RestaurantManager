import ProtectPage from "@/pages/admin/components/protectPage";
import { listConfigurationService } from "@/services/config";
import { setTableOrder } from "@/store/slices/orders.slice";
import { TConifg } from "@/types/configuration.types";
import { TOKEN_ID } from "@/utils/strings";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Joyride from "react-joyride";

export default function tableSelector() {
  const [loading, setLoading] = useState(false);
  const [kitchen, setKitchen] = useState([]);
  const [tour, setTour] = useState(false);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<any>([]);

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

  const handleTour = useCallback(() => {
    setTour(true);
  }, []);

  useEffect(() => {
    const joyrideSteps = [
      {
        content: (
          <h2 className='text-2xl'>
            En esta ventana tendremos el numero de mesas.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "center",
        target: "body",
      },
    ];

    setRun(tour);
    setSteps(joyrideSteps);
  }, [tour]);
  return (
    <ProtectPage push={router.push}>

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
      <div className='w-full p-8'>
        <p className='h-10 font-medium font-primary font-bold text-[1.5rem]'>
          ¿Que mesa atenderá?
        </p>
        <button
          className='bg-red-800 text-white w-20 h-8 rounded mx-2 my-2'
          onClick={handleTour}
        >
          Tutorial
        </button>
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
