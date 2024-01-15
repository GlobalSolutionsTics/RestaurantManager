import { IClientResponse } from "@/pages/api/directory/controllers/client";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectPage from "../../admin/components/protectPage";
import MenuCasher from "../components/menu";
import Head from "next/head";
import Swal from "sweetalert2";
import {
  AddOutlined,
  CancelOutlined,
  DeleteOutline,
  Edit,
  EditOutlined,
} from "@mui/icons-material";
import {
  createClientService,
  deleteClientService,
  listClienService,
  updateClientService,
} from "@/services/client";
import { TOKEN_ID } from "@/utils/strings";

const MessageComponent = withReactContent(Swal);

type PropsCol = {
  name: string;
  adress: string;
  index: number;
  phone: number;
  editFn: () => void;
  deleteFn: () => void;
};

const ColComponents = ({
  name,
  adress,
  phone,
  index,
  editFn,
  deleteFn,
}: PropsCol) => {
  return (
    <div
      className={`flex fle-row p-4 ${
        index % 2 === 0 ? "bg-enabled-dark" : "bg-enabled-light"
      }`}
    >
      <div className='font-secondary basis-1/4'>{name}</div>
      <div className='font-secondary basis-1/4'>{adress}</div>{" "}
      <div className='font-secondary basis-1/4'>{phone}</div>
      <div className='font-secondary basis-1/4 flex flex-row'>
        <button className='text-blue mr-4' onClick={editFn}>
          <EditOutlined />
        </button>
        <button className='text-danger' onClick={deleteFn}>
          <DeleteOutline />
        </button>
      </div>
    </div>
  );
};

const DirectoryPage = () => {
  const [clientList, setClientList] = useState<Array<IClientResponse>>([]);
  const [isLoading, setIsLoading] = useState(false);
  //Add modal controll
  const [showAddModal, setShowAddModal] = useState(false);
  //Edit modal controll
  const [showEditModal, setShowEditModal] = useState(false);
  const [initialStateEditModal, setInitialStateEditModal] = useState({
    name: "",
    adress: "",
    phone: 0,
    uuid: "",
  });
  //Delete modal controll
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUUID, setDeleteUUID] = useState("");
  const [nameDelete, setNameDelete] = useState("");

  const toggleAddModal = () => {
    if (!isLoading) {
      setShowAddModal(!showAddModal);
    }
  };

  const toggleEditModal = () => {
    if (!isLoading) {
      setShowEditModal(!showEditModal);
    }
  };

  const toggleDeleteModal = () => {
    if (!isLoading) {
      setDeleteUUID("");
      setNameDelete("");
      setShowDeleteModal(!showDeleteModal);
    }
  };

  const router = useRouter();

  const showMessage = (
    title: string,
    description: string,
    okText?: string,
    icon?: "error" | "success",
  ) => {
    MessageComponent.fire({
      icon: icon || "success",
      title: title,
      text: description,
      timer: 1500,
      confirmButtonText: okText,
      showConfirmButton: false,
      showLoaderOnConfirm: false,
      showLoaderOnDeny: false,
    });
  };

  const getClientList = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const client = await listClienService(token);
      setClientList(client);
    }
  };

  //Handle function to create client
  const handleSubmitAddModal = async (client: any) => {
    setIsLoading(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const create = await createClientService(client, token);
      if (create) {
        setShowAddModal(false);
        showMessage("Usuario creado", "Se creó el cliente exitosamente");
        await getClientList();
      } else {
        showMessage(
          "Ocurrió un error",
          "Ocurrií un error al crear el usuario",
          "Entendido",
          "error",
        );
      }
    }
    setIsLoading(false);
  };
  //Edit User
  const onEditSubmit = async (client: any) => {
    setIsLoading(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const update = await updateClientService(client, token);
      if (update) {
        setShowEditModal(false);
        showMessage(
          "Usuario modificado",
          "El usuario se modificó exitosamente",
        );
        await getClientList();
      } else {
        showMessage(
          "Ocurrió un error",
          "Ocurrió un error al modificar el usuario",
          "Entendido",
          "error",
        );
      }
    }
    setIsLoading(false);
  };
  //Delete User
  const onDelete = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const isDeleted = await deleteClientService(deleteUUID, token);
      if (isDeleted) {
        setShowAddModal(false);
        showMessage("Cliente se eliminó", "El usuario se eliminó exitosamente");
        await getClientList;
      } else {
        showMessage(
          "Ocurrió un error",
          "Ocurrió un error al eliminar al usuario",
          "Entendido",
          "error",
        );
      }
    }
    setIsLoading(false);
  };

  //Handle functions

  const handleEdit = (client: IClientResponse) => {
    setInitialStateEditModal(client);
    setShowEditModal(true);
  };

  const handleDelete = (uuid: string, name: string) => {
    setDeleteUUID(uuid);
    setNameDelete(name);
    setShowDeleteModal(true);
  };

  //Area of effects to incremetace a UX

  useEffect(() => {
    getClientList();
  }, []);

  //Initial values in formik to add user
  const INITIAL_VALUE_ADD_MODAL = {
    name: "",
    adress: "",
    phone: 0,
  };

  return (
    <ProtectPage push={router.push}>
      <Head>
        <title>Cajero | Directorio</title>
      </Head>
      <div>
        <div className='flex flex-row'>
          <MenuCasher router={router} basePath={router.pathname} />
          <div className='flex flex-col w-full h-min-[100vh] px-8 py-4'>
            <div className='flex flex-row justify-between'>
              <div className='font-primary text-[2rem] mb-4 text-black'>
                Directorio de clientes
              </div>
            </div>
            <div className='flex flex-col w-full h-[100vh] py-4'>
              <div className='flex justify-end'>
                <button
                  className='bg-aqua font-secondary p-2 text-white'
                  onClick={toggleAddModal}
                >
                  <AddOutlined /> Añadir cliente
                </button>
              </div>
              <div className='flex flex-row bg-blue p-4'>
                <div className='font-secondary text-white font-bold basis-1/3'>
                  Nombre
                </div>
                <div className='font-secondary text-white font-bold basis-1/3'>
                  Dirección
                </div>
                <div className='font-secondary text-white font-bold basis-1/3'>
                  Telefono
                </div>
              </div>
              <div className='grid lg:grid-cols-4 lg:gap-4 md:grid-cols-3 md:gap-3 sm:grid-cols-1 sm:gap-1 overflow-y-auto '>
                <div>momria</div>
                <div>fde</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectPage>
  );
};

export default DirectoryPage;
