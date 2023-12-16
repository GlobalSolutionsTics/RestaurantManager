import ProtectPage from "@/pages/admin/components/protectPage";
import { IUserRedux } from "@/store/slices/user.slice";
import { TOKEN_ID } from "@/utils/strings";
import {
  AddOutlined,
  ListAltOutlined,
  PowerSettingsNew,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Joyride from "react-joyride";

export default function createIndex() {
  const personStore: IUserRedux = useSelector((store: any) => store.user);
  const router = useRouter();

  const handleOrderNavigate = () => {
    router.push("/orders/myOrders");
  };

  const handleNavigation = () => {
    router.push("/orders/tableSelect");
  };

  const handleClose = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    sessionStorage.removeItem(TOKEN_ID);
    router.push("/admin");
  }, []);

  const [{ run, steps }, setState] = useState<{ run: boolean; steps: any }>({
    run: true,
    steps: [
      {
        content: (
          <h2 className='text-2xl'>
            ¡Bienvenido {personStore.name}! Empezemos con el recorrido.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: <h2 className='text-2xl'>Aqui se muestra tu nombre.</h2>,
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#first-step",
        title: "Nombre",
      },
      {
        content: (
          <h2 className='text-2xl'>Se mostraran las ordenes activas.</h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#second-step",
        title: "Mis ordenes",
      },
      {
        content: (
          <h2 className='text-2xl'>Aquí se podrán hacer nuevas ordenes.</h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#thirth-step",
        title: "Nueva orden",
      },
      {
        content: (
          <h2 className='text-2xl'>
            Te llevará de nuevo a la ventana de inicio de sesión.
          </h2>
        ),
        locale: { skip: <strong>OMITIR</strong> },
        placement: "bottom",
        target: "#fourth-step",
        title: "Cerrar sesión",
      },
    ],
  });

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
      <div className='flex flex-row justify-between w-full p-4'>
        <div
          className='bg-white text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-primary basis-3/4'
          id='first-step'
        >
          {personStore.name}
        </div>
        <div className='flex justify-end basis-1/4'>
          <button className='bg-white' onClick={handleClose} id='fourth-step'>
            <PowerSettingsNew />
          </button>
        </div>
      </div>
      <div className='grid h-screen w-full'>
        <div className='m-auto flex flex-col items-center w-full p-4 md:p-6 lg:p-8'>
          <div className='py-6 w-full'>
            <button
              id='second-step'
              onClick={handleOrderNavigate}
              className='disabled:bg-neutral-400 w-full h-[80px] font-primary text-[2rem] bg-blue text-white'
            >
              <ListAltOutlined /> Mis ordenes
            </button>
          </div>
          <div className='py-6 w-full'>
            <button
              id='thirth-step'
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
