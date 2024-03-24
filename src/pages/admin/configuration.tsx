import { useRouter } from "next/router";
import ProtectPage from "./components/protectPage";
import Head from "next/head";
import MenuAdmin from "./components/menu";
import {
  EditOutlined,
  MiscellaneousServicesOutlined,
} from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import {
  listConfigurationService,
  updateConfigurationService,
} from "@/services/config";
import { useEffect, useState } from "react";
import { TConifg } from "@/types/configuration.types";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { TOKEN_ID } from "@/utils/strings";
import { ADMIN, TOKEN } from "@/utils/users";

const MessageComponent = withReactContent(Swal);

const ConfigurationPage = () => {
  const [configuration, setConfiguration] = useState<TConifg>({
    kitchens: 0,
    tablesActives: 0,
    mode: "light",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPrincipal, setLoadingPrincipal] = useState(false);

  const router = useRouter();

  //Funcion para mostrar mensajes
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

  //Services of config
  const getConfigurations = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      const petition = await listConfigurationService(token);
      setConfiguration(petition);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  const updateConfiguration = async (payload: TConifg) => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoadingPrincipal(true);
    if (token) {
      const petition = await updateConfigurationService(token, payload);
      if (petition) {
        await getConfigurations();
        showMessage(
          "Datos actualizados",
          "Configuración actualizada correctamente",
        );
      } else {
        showMessage(
          "Ocurrio un error",
          "Ocurrio un error al actualizar la información",
          "Entendido",
          "error",
        );
      }
    } else {
      router.push("/admin");
    }
    setLoadingPrincipal(false);
  };

  //Cargas iniciales
  useEffect(() => {
    getConfigurations();
  }, []);

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Administrador | Configurar aplicación</title>
      </Head>
      <div
        className={`flex flex-row ${
          configuration.mode === "light" ? "bg-white" : "bg-dark"
        }`}
      >
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='flex flex-col w-full h-min-[100vh] p-4'>
          <div className='flex flex-col w-full mb-8'>
            <p
              className={`font-primary text-[2rem] ${
                configuration.mode === "light"
                  ? "text-blue-dark"
                  : "text-blue-light"
              }`}
            >
              <MiscellaneousServicesOutlined
                fontSize='large'
                className='mr-2'
              />{" "}
              Configuración
            </p>
            <p
              className={`font-secondary text-[1rem] ${
                configuration.mode === "light"
                  ? "text-steel-70"
                  : "text-steel-20"
              }`}
            >
              Aquí puedes configurar el proyecto para que se adapte a tus
              necesidades.
            </p>
          </div>
          {loading ? (
            <div className='flex items-center'>
              <span className='loader mr-4'></span> Cargando información de
              configuración
            </div>
          ) : (
            <Formik
              initialValues={configuration}
              onSubmit={updateConfiguration}
            >
              {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit} className='flex flex-col'>
                  <div className='w-full flex flex-row wrap'>
                    <FormControl className='basis-1/2 mr-4'>
                      <InputLabel htmlFor='outline-input-kitchen'>
                        Cocinas en activas
                      </InputLabel>
                      <OutlinedInput
                        id='outline-input-kitchen'
                        name='kitchens'
                        label='Cocinas en uso'
                        className='rounded-lg'
                        type='number'
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        value={values.kitchens}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    <FormControl className='basis-1/2'>
                      <InputLabel htmlFor='outline-input-tablesactive'>
                        Mesas en activas
                      </InputLabel>
                      <OutlinedInput
                        id='outline-input-tablesactive'
                        name='tablesActives'
                        label='Mesas en activas'
                        className='rounded-lg'
                        type='number'
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        value={values.tablesActives}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                  </div>
                  <div className='w-full flex mt-4'>
                    <FormControl className='basis-1/2 mr-4'>
                      <InputLabel id='select-mode'>
                        Tema del proyecto
                      </InputLabel>
                      <Select
                        labelId='select-mode'
                        id='select-mode'
                        label='Tema del proyecto'
                        name='mode'
                        value={values.mode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value='light'>Modo normal</MenuItem>
                        <MenuItem value='dark'>Modo obscuro</MenuItem>
                      </Select>
                    </FormControl>
                    <div className='flex flex-col basis-1/2 justify-between py-2'>
                      <p className='font-primary text-[0.75rem] text-blue-dark'>
                        Tipo de plan
                      </p>
                      <p className='font-secondary text-[1.25rem] text-steel-70'>
                        Infinite
                      </p>
                    </div>
                  </div>
                  <div className='mt-4'>
                    {loadingPrincipal ? (
                      <div className='flex items-center'>
                        <span className='loader mr-4'></span> Guardando
                        Información
                      </div>
                    ) : (
                      <button
                        type='submit'
                        className='bg-success text-white p-4 rounded-lg hover:bg-success-dark'
                      >
                        <EditOutlined /> Actualizar
                      </button>
                    )}
                  </div>
                </form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </ProtectPage>
  );
};

export default ConfigurationPage;
