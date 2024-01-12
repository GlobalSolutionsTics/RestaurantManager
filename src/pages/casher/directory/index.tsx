import { IClientResponse } from "@/pages/api/directory/controllers/client";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
import { useState } from "react";
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
import { listClient } from "@/pages/api/directory/controllers/client";

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
  const [userList, setUserList] = useState<Array<IClientResponse>>([]);
  const [isLoading, setIsLoading] = useState(false);
  //Add modal controll
  const [showAddModal, setShowAddModal] = useState(false);
  //Edit modal controll
  const [showEditModal, setShowEditModal] = useState(false);
  const [initialStateEditModal, setInitialStateEditModal] = useState({
    name: "",
    phone: "",
    adress: "",
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

  const getUsersList = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const users = await listClientSerive(token);
      setUserList(users);
    }
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
                <button className='mx-8 p-2 px-2 bg-success-dark text-white font-primary mb-4 hover:bg-success'>
                  +Agregar
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
