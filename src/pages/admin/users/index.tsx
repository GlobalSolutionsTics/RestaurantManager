import { useRouter } from "next/router";
import MenuAdmin from "../components/menu";
import { useEffect, useState } from "react";
import { IUsersResponse } from "@/pages/api/auth/controller/users";
import {
  createUserService,
  deleteUserService,
  listUserSerive,
  updateUserService,
} from "@/services/users";
import {
  AddOutlined,
  CancelOutlined,
  DeleteOutline,
  Edit,
  EditOutlined,
} from "@mui/icons-material";
import Head from "next/head";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ProtectPage from "../components/protectPage";
import { TOKEN_ID } from "@/utils/strings";

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
  user: string;
  name: string;
  type: string;
  index: number;
  editFn: () => void;
  deleteFn: () => void;
};

const ColComponents = ({
  user,
  name,
  type,
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
      <div className='font-secondary basis-1/4'>{user}</div>
      <div className='font-secondary basis-1/4'>{name}</div>
      <div className='font-secondary basis-1/4'>{type}</div>
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

const UsersAdministratorPage = () => {
  const [userList, setUserList] = useState<Array<IUsersResponse>>([]);
  const [isLoading, setIsLoading] = useState(false);
  //Add modal controll
  const [showAddModal, setShowAddModal] = useState(false);
  //Edit modal controll
  const [showEditModal, setShowEditModal] = useState(false);
  const [initialStateEditModal, setInitialStateEditModal] = useState({
    name: "",
    user: "",
    password: "",
    type: "",
    uuid: "",
  });
  //Delete modal controll
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUUID, setDeleteUUID] = useState("");
  const [nameDelete, setNameDelete] = useState("");

  /**
   * Toggle modals functions
   */

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

  /**
   * Area of services invocation
   */
  //List of users
  const getUsersList = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const users = await listUserSerive(token);
      setUserList(users);
    }
  };

  //Handle function to create user
  const handleSubmitAddModal = async (user: any) => {
    setIsLoading(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const create = await createUserService(user, token);
      if (create) {
        setShowAddModal(false);
        showMessage("Usuario creado", "Se creo el usuario exitosamente");
        await getUsersList();
      } else {
        showMessage(
          "Ocurrio un error",
          "Ocurrio un error al crear el usuario",
          "Entendido",
          "error",
        );
      }
    }
    setIsLoading(false);
  };
  //Funtion to edit user
  const onEditSubmit = async (user: any) => {
    setIsLoading(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const update = await updateUserService(user, token);
      if (update) {
        setShowEditModal(false);
        showMessage(
          "Usuario modificado",
          "El usuario se modifico exitosamente",
        );
        await getUsersList();
      } else {
        showMessage(
          "Ocurrio un error",
          "Ocurrio un error al modificar el usuario",
          "Entendido",
          "error",
        );
      }
    }
    setIsLoading(false);
  };
  //Function delete user
  const onDelete = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const isDeleted = await deleteUserService(deleteUUID, token);
      if (isDeleted) {
        setShowDeleteModal(false);
        showMessage("Usuario se elimino", "El usuario se elimino exitosamente");
        await getUsersList();
      } else {
        showMessage(
          "Ocurrio un error",
          "Ocurrio un error al eliminar al usuario",
          "Entendido",
          "error",
        );
      }
    }
    setIsLoading(false);
  };

  /**
   * Area of handle functions
   */

  const handleEdit = (user: IUsersResponse) => {
    setInitialStateEditModal(user);
    setShowEditModal(true);
  };

  const handleDelete = (uuid: string, name: string) => {
    setDeleteUUID(uuid);
    setNameDelete(name);
    setShowDeleteModal(true);
  };

  /**
   * Area of effects to incremetace a UX
   */

  useEffect(() => {
    getUsersList();
  }, []);

  //Initial values in formik to add user
  const INITIAL_VALUE_ADD_MODAL = {
    name: "",
    user: "",
    password: "",
    type: "",
  };

  return (
    <ProtectPage push={router.push}>
      <Head>
        <title>Administrador | Usuarios</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
        <div className='flex flex-col w-full h-min-[100vh] p-8'>
          <p className='font-primary text-[2rem] mb-4 text-black'>
            Lista de usuarios
          </p>
          <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between mb-4'>
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
                  <AddOutlined /> Añadir usuario
                </button>
              </div>
            </div>
            <div className='flex flex-row bg-blue p-4'>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Usuario
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Nombre
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Tipo
              </div>
              <div className='font-secondary text-white font-bold basis-1/4'>
                Acciones
              </div>
            </div>
            {userList?.length > 0 ? (
              userList.map((itm, ind) => (
                <ColComponents
                  index={ind}
                  key={itm.uuid}
                  name={itm.name}
                  user={itm.user}
                  type={itm.type}
                  editFn={() => handleEdit(itm)}
                  deleteFn={() => handleDelete(itm.uuid, itm.name)}
                />
              ))
            ) : (
              <div> No hay usuarios que mostrar </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={showAddModal} onClose={toggleAddModal}>
        <Box sx={style}>
          <p className='font-primary text-[1.5rem] mb-4'>Añadir usuario</p>
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
                      Usuario
                    </InputLabel>
                    <OutlinedInput
                      id='outline-user-input'
                      label='Usuario'
                      name='user'
                      value={values.user}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <div className='flex flex-row mt-4'>
                  <FormControl fullWidth className='basis-1/2 !mr-4'>
                    <InputLabel htmlFor='outline-password-input'>
                      Contraseña
                    </InputLabel>
                    <OutlinedInput
                      id='outline-password-input'
                      label='Contraseña'
                      name='password'
                      type='password'
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormControl fullWidth className='basis-1/2'>
                    <InputLabel htmlFor='outline-tipo-input'>
                      Tipo de usuario
                    </InputLabel>
                    <Select
                      id='outline-password-input'
                      label='Contraseña'
                      name='type'
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    >
                      <MenuItem value='admin'>Administrador</MenuItem>
                      <MenuItem value='mesero'>Mesero</MenuItem>
                      <MenuItem value='cocina_Fria'>Cocina Fría</MenuItem>
                      <MenuItem value='cocina_Caliente'>
                        Cocina Caliente
                      </MenuItem>
                      <MenuItem value='caja'>Caja</MenuItem>
                    </Select>
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
      <Modal open={showEditModal} onClose={toggleEditModal}>
        <Box sx={style}>
          <p className='font-primary text-[1.5rem] mb-2'>Editar usuario</p>
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
                      Usuario
                    </InputLabel>
                    <OutlinedInput
                      id='outline-user-input'
                      label='Usuario'
                      name='user'
                      value={values.user}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <div className='flex flex-row mt-4'>
                  <FormControl fullWidth className='basis-1/2 !mr-4'>
                    <InputLabel htmlFor='outline-password-input'>
                      Contraseña
                    </InputLabel>
                    <OutlinedInput
                      id='outline-password-input'
                      label='Contraseña'
                      name='password'
                      type='password'
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormControl fullWidth className='basis-1/2'>
                    <InputLabel htmlFor='outline-tipo-input'>
                      Tipo de usuario
                    </InputLabel>
                    <Select
                      id='outline-password-input'
                      label='Contraseña'
                      name='type'
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                    >
                      <MenuItem value='admin'>Administrador</MenuItem>
                      <MenuItem value='mesero'>Mesero</MenuItem>
                      <MenuItem value='cocina_1'>Cocina 1</MenuItem>
                      <MenuItem value='cocina_2'>Cocina 2</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className='mt-4'>
                  {isLoading ? (
                    <div className='flex items-center'>
                      <span className='loader mr-4'></span> Modificando usuario
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
          <p className='font-primary text-[1.5rem] mb-2'>
            ¿Desea eliminar a este usuario?
          </p>
          <p className='font-secondary mb-4'>
            ¿Está seguro de está acción? La información de <b>{nameDelete}</b>{" "}
            se perdera de forma permanente
          </p>
          <div className='flex flex-row'>
            {isLoading ? (
              <div className='flex items-center'>
                <span className='loader mr-4'></span> Borrando usuario
              </div>
            ) : (
              <>
                <div className='flex basis-1/2'>
                  <button
                    className='w-[150px] bg-danger text-white p-4 rounded-lg'
                    onClick={onDelete}
                  >
                    <DeleteOutline /> Borrar
                  </button>
                </div>
                <div className='flex justify-end basis-1/2'>
                  <button
                    className='w-[150px] bg-enabled-dark p-4 rounded-lg'
                    onClick={toggleDeleteModal}
                  >
                    <CancelOutlined /> Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </ProtectPage>
  );
};

export default UsersAdministratorPage;
