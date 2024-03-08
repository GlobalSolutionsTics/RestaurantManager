import Head from "next/head";
import ProtectPage from "./components/protectPage";
import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import { DoneOutline, Notifications, RoomService } from "@mui/icons-material";
import { StatusApplicationEnum, StatusEnum } from "@/enums/states.enum";
import { TResponseOrders } from "@/types/menu.types";
import { useCallback, useEffect, useState } from "react";
import { TOKEN_ID } from "@/utils/strings";
import { acceptEditService, getApplicationList } from "@/services/order";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";

type Props = {
  element: TResponseOrders;
  itemComplete: any;
  acceptFn: () => void;
};

const MessageComponent = withReactContent(Swal);

const ToggleColumn = ({ element, itemComplete, acceptFn }: Props) => {
  const [loading, setLoading] = useState(false);
  //Color controller
  const getColorForHeader = (status: string) => {
    if (itemComplete.applicationStatus === StatusApplicationEnum.ACTIVE) {
      return "bg-success-dark text-dark";
    } else if (itemComplete.applicationStatus === StatusApplicationEnum.CLOSE) {
      return "bg-success-dark text-white";
    }

    return "bg-danger-dark text-white";
  };

  const getColorButton = (status: string) => {
    if (status === StatusEnum.IN_PROGRESS) {
      return "bg-waiting-dark hover:bg-waiting-dark hover:text-dark";
    } else if (status === StatusEnum.ORDER_READY) {
      return "bg-success-dark text-white";
    }

    return "bg-danger hover:bg-danger-dark text-white";
  };

  const handleEdit = async () => {
    setLoading(true);
    const payload = {
      applicationId: itemComplete.uuid,
      modifications: itemComplete.modifications,
    };
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const response = await acceptEditService(token, payload);
      if (response) {
        MessageComponent.fire({
          icon: "success",
          title: "Edicion aceptada",
          text: "La cocina a sido notificada de la edición",
          confirmButtonText: "Entendido",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
          preConfirm: () => acceptFn(),
        });
      } else {
        MessageComponent.fire({
          icon: "error",
          title: "Ocurrio un error",
          text: "Ocurrio un error al aceptar la solicitud, intente de nuevo",
          confirmButtonText: "Entendido",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
        });
      }
    }
    setLoading(false);
  };
  return (
    <div className='w-full rounded-lg shadow-lg bg-white flex flex-col justify-between'>
      <div className='flex flex-col'>
        <div
          className={`flex flex-row w-full font-secondary text-bold p-2 ${getColorForHeader(
            element.status,
          )} text-white rounded-t-lg`}
        >
          <div className='text-[1rem] basis-4/6'>
            {element.tableNumber === DEFAULT_TABLE_LLEVAR && "Para llevar"}
            {element.tableNumber !== DEFAULT_TABLE_LLEVAR && (
              <>Mesa {element.tableNumber}</>
            )}
          </div>
          <div className='text-[1rem] basis-2/6'>
            <RoomService /> {element.dishes}
          </div>
        </div>
        <div className='p-2 flex flex-col'>
          {element.dishesDescription.map((dish: any) => (
            <div key={dish.uuid} className='flex flex-row font-secondary'>
              <div className='basis-5/6'>{dish.name}</div>
              <div className='basis-1/6'>{dish.number}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='p-2'>
        {loading ? (
          <div className='flex items-center'>
            <span className='loader mr-4'></span> Notificando
          </div>
        ) : itemComplete.applicationStatus === StatusApplicationEnum.ACTIVE ||
          itemComplete.applicationStatus === StatusApplicationEnum.CLOSE ? (
          <></>
        ) : (
          <button
            className={`p-1 w-full rounded-lg transition ease-in-out delay-150 duration-300 ${getColorButton(
              element.status,
            )} `}
            onClick={handleEdit}
          >
            <DoneOutline /> Aceptar
          </button>
        )}
      </div>
    </div>
  );
};

const ApplicationAdminPage = () => {
  const [viewSelected, setViewSelected] = useState(StatusApplicationEnum.SEND);
  const [listRejected, setListRejected] = useState([]);
  const [listActived, setListActive] = useState([]);
  const [listSended, setListSended] = useState([]);

  const router = useRouter();
  //Handles
  const handleChangeView = (status: StatusApplicationEnum) =>
    setViewSelected(status);

  //Initial Orders
  const init = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const data = await getApplicationList(token);
      const filterSend = data.filter(
        (itm: any) => itm.applicationStatus === StatusApplicationEnum.SEND,
      );
      const filterActive = data.filter(
        (itm: any) => itm.applicationStatus === StatusApplicationEnum.ACTIVE,
      );
      const filterRejected = data.filter(
        (itm: any) =>
          itm.applicationStatus === StatusApplicationEnum.REJECTED ||
          itm.applicationStatus === StatusApplicationEnum.CLOSE,
      );

      setListSended(filterSend);
      setListActive(filterActive);
      setListRejected(filterRejected);
    }
  }, [viewSelected]);

  useEffect(() => {
    init();
  }, [viewSelected]);
  return (
    <ProtectPage push={router.push} requiredProfiles={"admin"}>
      <Head>
        <title>Administrador | Solicitudes de cambio</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='flex flex-col w-full h-min-[100vh] p-8'>
          <div className='flex flex-row justify-between'>
            <p className='flex items-center font-primary text-[2rem] mb-4 text-black'>
              <Notifications fontSize='large' className='mr-4' /> Solicitudes de
              edición
            </p>
            <div>
              <Button
                className={
                  viewSelected === StatusApplicationEnum.SEND
                    ? "!bg-blue !text-white"
                    : ""
                }
                onClick={() => handleChangeView(StatusApplicationEnum.SEND)}
              >
                Nuevas
              </Button>
              <Button
                className={
                  viewSelected === StatusApplicationEnum.ACTIVE
                    ? "!bg-blue !text-white"
                    : ""
                }
                onClick={() => handleChangeView(StatusApplicationEnum.ACTIVE)}
              >
                Activas
              </Button>
              <Button
                className={
                  viewSelected === StatusApplicationEnum.CLOSE
                    ? "!bg-blue !text-white"
                    : ""
                }
                onClick={() => handleChangeView(StatusApplicationEnum.CLOSE)}
              >
                Cerradas
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 bg-enabled p-4 w-full min-h-[calc(100vh_-_132px)]'>
            {viewSelected === StatusApplicationEnum.SEND &&
              listSended.map((itm: any) => (
                <ToggleColumn
                  element={itm.modifications}
                  itemComplete={itm}
                  acceptFn={init}
                />
              ))}
            {viewSelected === StatusApplicationEnum.ACTIVE &&
              listActived.map((itm: any) => (
                <ToggleColumn
                  element={itm.modifications}
                  itemComplete={itm}
                  acceptFn={init}
                />
              ))}
            {viewSelected === StatusApplicationEnum.CLOSE &&
              listRejected.map((itm: any) => (
                <ToggleColumn
                  element={itm.modifications}
                  itemComplete={itm}
                  acceptFn={init}
                />
              ))}
          </div>
        </div>
      </div>
    </ProtectPage>
  );
};
export default ApplicationAdminPage;
