import { IClientResponse } from "@/pages/api/directory/controllers/client";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ProtectPage from "../../admin/components/protectPage";
import MenuCasher from "../components/menu";
import Head from "next/head";
import Swal from "sweetalert2";
import Image from "next/image";
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
  Modal,
  OutlinedInput,
} from "@mui/material";
import {
  createClientService,
  deleteClientService,
  listClientService,
  updateClientService,
} from "@/services/client";
import { TOKEN_ID } from "@/utils/strings";
import { Formik } from "formik";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { TDirectory } from "@/types/directory.types";
import { CASHER, TOKEN } from "@/utils/users";
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
  printFn: () => void;
};

const ColComponents = ({
  name,
  adress,
  phone,
  index,
  editFn,
  deleteFn,
  printFn,
}: PropsCol) => {
  return (
    <div
      className={`flex fle-row p-4 ${
        index % 2 === 0 ? "bg-enabled-dark" : "bg-enabled-light"
      }`}
    >
      <div className='font-secondary basis-1/4 flex items-center'>{name}</div>
      <div className='font-secondary basis-1/4 flex items-center'>{adress}</div>
      <div className='font-secondary basis-1/4 flex items-center'>{phone}</div>
      <div className='font-secondary basis-1/4 flex flex-row'>
        <button className='text-blue mr-4' onClick={editFn}>
          <EditOutlined />
        </button>
        <button className='text-danger mr-4' onClick={deleteFn}>
          <DeleteOutline />
        </button>
        <button onClick={printFn}>
          <PrintIcon />
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
  //Print modal controll
  const [showModalPrint, setShowModalPrint] = useState(false);
  const [dataOrderSelected, setDataOrderSelected] = useState({
    name: "",
    adress: "",
    phone: 0,
    uuid: "",
  });
  const componentRef = useRef(null);

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

  const toggleModalPrint = () => {
    if (showModalPrint) {
      setDataOrderSelected({
        name: "",
        adress: "",
        phone: 0,
        uuid: "",
      });
      setShowModalPrint(false);
    } else {
      setShowModalPrint(true);
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
          "Ocurrió un error al crear el cliente",
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
        setShowDeleteModal(false);
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

  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const handlePrintData = (data: TDirectory) => {
    setDataOrderSelected(data);
    setShowModalPrint(true);
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
    <ProtectPage push={router.push} requiredProfiles={CASHER}>
      <Head>
        <title>Cajero | Directorio</title>
      </Head>
      <div className='flex flex-row'>
        <MenuCasher router={router} basePath={router.pathname} />
        <div className='flex flex-col w-full h-min-[100vh] px-8 py-4'>
          <p className='font-primary text-[2rem] mb-4 text-black'>
            Directorio de clientes
          </p>
          <div className='flex flex-col w-full'>
            <div className='flex justify-row justify-between mb-4'>
              <div>
                <input
                  type='text'
                  placeholder='Buscar'
                  className='font-secondary sp-2'
                />
              </div>
              <div>
                <button
                  className='bg-aqua font-secondary p-2 text-white'
                  onClick={toggleAddModal}
                >
                  <AddOutlined /> Añadir cliente
                </button>
              </div>
            </div>
            <div className='flex flex-row bg-blue p-4'>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Nombre
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Dirección
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Telefono
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Acciones
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
                  printFn={() => handlePrintData(itm)}
                />
              ))
            ) : (
              <div> No hay clientes que mostrar </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={showAddModal} onClose={toggleAddModal}>
        <Box sx={style}>
          <p className='font-primary text-[2rem] mb-4'>Añadir cliente</p>
          <Formik
            initialValues={INITIAL_VALUE_ADD_MODAL}
            onSubmit={handleSubmitAddModal}
          >
            {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className='flex flex-row'>
                  <FormControl fullWidth className='basis-1/2 !mr-4'>
                    <InputLabel htmlFor='outline-name-input'>Nombre</InputLabel>
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
                      <span className='loader mr-4'></span> Creando cliente
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
      <Modal open={showEditModal} onClose={toggleEditModal}>
        <Box sx={style}>
          <p className='font-primary text-[2rem] mb-2'>Editar cliente</p>
          <Formik initialValues={initialStateEditModal} onSubmit={onEditSubmit}>
            {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className='font-secondary mb-4'>UUID: {values.uuid}</div>
                <div className='flex flex-row'>
                  <FormControl fullWidth className='basis-1/2 !mr-4'>
                    <InputLabel htmlFor='outline-name-input'>Nombre</InputLabel>
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
                      id='outline-user-input'
                      label='Telefono'
                      name='phone'
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <div className='mt-4'>
                  <FormControl fullWidth className='basis-1/2 !mr-4'>
                    <InputLabel htmlFor='outline-user-input'>
                      Dirección
                    </InputLabel>
                    <OutlinedInput
                      id='outline-user-input'
                      label='Direccion'
                      name='adress'
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
                      <span className='loader mr-4'></span>Modificado cliente
                    </div>
                  ) : (
                    <button
                      type='submit'
                      className='bg-success text-white font-secondary p-2 w-[150px] rounded-lg'
                    >
                      <Edit /> Actualizar
                    </button>
                  )}
                </div>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
      <Modal open={showDeleteModal} onClose={toggleDeleteModal}>
        <Box sx={style}>
          <p className='font-primary text-[2rem] mb-2'>
            ¿Desea eliminar a este usuario?
          </p>
          <p className='font-secondary mb-4'>
            ¿Está seguro de esta acción? La información de <b>{nameDelete}</b>{" "}
            se perderá de forma permanente
          </p>
          <div className='flex flex-row'>
            {isLoading ? (
              <div className='flex items-center'>
                <span className='loader mr-4'></span>Borrando cliente
              </div>
            ) : (
              <>
                <div className='flex basis-1/2'>
                  <button
                    className='w-[150px] bg-danger text-white p-4 rounded-lg'
                    onClick={onDelete}
                  >
                    <DeleteOutline />
                    Borrar
                  </button>
                </div>
                <div className='flex justify-end basis-1/2'>
                  <button
                    className='w-[150px] bg-enabled-dark p-4 rounded-lg'
                    onClick={toggleDeleteModal}
                  >
                    <CancelOutlined />
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </Box>
      </Modal>
      <Modal open={showModalPrint} onClose={toggleModalPrint}>
        <Box sx={style}>
          <button
            onClick={handlePrint}
            className='bg-aqua text-white font-secondary p-2'
          >
            IMPRIMIR
          </button>
          <div ref={componentRef} className='mb-4 px-4'>
            <div className='flex items-center justify-center'>
              <Image
                src={"/logo_con_fondo.png"}
                width={150}
                height={150}
                alt='Image logo'
              />
            </div>
            <p className='font-primary font-bold text-center mb-2'>
              Maris Querida
            </p>
            <div>
              {clientList.map((itm) => (
                <div key={itm.uuid}>
                  <div className='font-bold'> Cliente:</div>
                  <div> {itm.name}</div>
                  <div className='font-bold'>Direccion:</div>
                  <div> {itm.adress}</div>
                  <div className='font-bold'>Telefono:</div>
                  <div> {itm.phone}</div>
                </div>
              ))}
            </div>
            <div className='flex items-center justify-center font-bold font-secondary'>
              ¡Gracias por su compra!
            </div>
          </div>
        </Box>
      </Modal>
    </ProtectPage>
  );
};

export default DirectoryPage;
