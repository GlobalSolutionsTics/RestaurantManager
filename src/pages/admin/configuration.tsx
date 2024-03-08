import { useRouter } from "next/router";
import ProtectPage from "./components/protectPage";
import Head from "next/head";
import MenuAdmin from "./components/menu";
import {
  EditOutlined,
  MiscellaneousServicesOutlined,
} from "@mui/icons-material";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
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
import { ADMIN } from "@/utils/users";

const MessageComponent = withReactContent(Swal);

const ConfigurationPage = () => {
  const [configuration, setConfiguration] = useState<TConifg>({
    kitchens: 0,
    tablesActives: 0,
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
      <div className='flex flex-row'>
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='flex flex-col w-full h-min-[100vh] p-8'>
          <p className='font-primary text-[2rem] mb-4 text-black'>
            <MiscellaneousServicesOutlined fontSize='large' /> Configuración
          </p>
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
                  <div className='w-full flex flex-row'>
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
