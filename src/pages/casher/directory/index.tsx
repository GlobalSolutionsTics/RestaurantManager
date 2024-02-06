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
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import {
  createClientService,
  deleteClientService,
  listClientService,
  updateClientService,
} from "@/services/client";
import { TOKEN_ID } from "@/utils/strings";
import { Formik } from "formik";

const MessageComponent = withReactContent(Swal);

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
      try {
        const client = await listClientService(token);
        console.log("Lista de clientes:", client);
        setClientList(client);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    }
  };

  //Handle function to create client
  const handleSubmitAddModal = async (client: any) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem(TOKEN_ID);
      const create = await createClientService(client, token);
      console.log(create);
      if (create) {
        setShowAddModal(false);
        showMessage("Usuario creado", "Se creó el cliente exitosamente");
        await getClientList();
      } else {
        showMessage(
          "Ocurrió un error",
          "Ocurrió un error al crear el cliente",
          "Entendido",
          "error",
        );
      }
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      showMessage(
        "Ocurrió un error",
        "Ocurrió un error al crear el cliene",
        "Entendido",
        "error",
      );
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
        await getClientList();
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
              <p className='font-primary text-[2rem] mb-4 text-black'>
                Directorio de clientes
              </p>
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
              {clientList?.length > 0 ? (
                clientList.map((itm, ind) => (
                  <ColComponents
                    index={ind}
                    key={itm.uuid}
                    name={itm.name}
                    phone={itm.phone}
                    adress={itm.adress}
                    editFn={() => handleEdit(itm)}
                    deleteFn={() => handleDelete(itm.uuid, itm.name)}
                  />
                ))
              ) : (
                <div> No hay clientes que mostrar </div>
              )}
            </div>
          </div>
          <Modal open={showAddModal} onClose={toggleAddModal}>
            <Box sx={style}>
              <p className='font-primary text-[1.5rem] mb-4'>Añadir usuario</p>
              <Formik
                initialValues={INITIAL_VALUE_ADD_MODAL}
                onSubmit={handleSubmitAddModal}
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className='flex flex-row'>
                      <FormControl fullWidth className='basis-1/2 !mr-4'>
                        <InputLabel htmlFor='outline-name-input'>
                          Nombre
                        </InputLabel>
                        <OutlinedInput
                          id='outline-name-input'
                          label='Nombre'
                          name='name'
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormControl fullWidth className='basis-1/2'>
                        <InputLabel htmlFor='outline-user-input'>
                          Telefono
                        </InputLabel>
                        <OutlinedInput
                          id='outline-phone-input'
                          label='Phone'
                          name='phone'
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <div className='flex flex-row mt-4'>
                      <FormControl fullWidth className='basis-1/2 !mr-4'>
                        <InputLabel htmlFor='outline-password-input'>
                          Direccion
                        </InputLabel>
                        <OutlinedInput
                          id='outline-adress-input'
                          label='Direccion'
                          name='adress'
                          type='adress'
                          value={values.adress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <div className='mt-4'>
                      {isLoading ? (
                        <div className='flex items-center'>
                          <span className='loader mr-4'></span> Creando usuario
                        </div>
                      ) : (
                        <button
                          type='submit'
                          className='bg-success text-white font-secondary p-2 w-[150px] rounded-lg'
                        >
                          <AddOutlined /> Crear
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </Formik>
            </Box>
          </Modal>
        </div>
      </div>
    </ProtectPage>
  );
};

export default DirectoryPage;
