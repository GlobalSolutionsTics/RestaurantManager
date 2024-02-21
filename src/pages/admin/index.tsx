import { UsersTypesEnum } from "@/enums/users.types";
import { loginService } from "@/services/auth";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { OpenInFull } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { IUserRedux, saveUserInRedux } from "@/store/slices/user.slice";
import { TOKEN_ID } from "@/utils/strings";

const MessageComponent = withReactContent(Swal);

const IndexComp = () => {
  const { push } = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFullscreen = useFullScreenHandle();
  //Redux controller
  const dispatch = useDispatch();

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

  //Handler functions
  const handleUser = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const usuario = e.target.value;
    setUser(usuario);
  };

  const handlePass = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const password = e.target.value;
    setPass(password);
  };

  const handleSend = async () => {
    setLoading(true);
    const login = await loginService(user, pass);
    if (login) {
      const token = login.token;
      const tipo = login.type;
      //Token validation
      const separate = token.split(".");
      const information = separate[1];
      const decodeInfo: IUserRedux = JSON.parse(atob(information));
      const payloadUser: IUserRedux = {
        name: decodeInfo.name,
        type: decodeInfo.type,
        uuid: decodeInfo.uuid,
      };
      dispatch(saveUserInRedux(payloadUser));
      sessionStorage.setItem(TOKEN_ID, token);

      if (tipo === UsersTypesEnum.MESERO) {
        push("/orders/create");
      } else if (tipo === UsersTypesEnum.ADMINISTRATOR) {
        push("/admin/dishes");
      } else if (tipo === UsersTypesEnum.COCINERO) {
        push("/orders");
      } else if (tipo === UsersTypesEnum.CAJERO) {
        push("/casher/orders");
      }
    } else {
      showMessage(
        "No se pudo loguear",
        "Usuario y/o contraseña incorrectos",
        "Aceptar",
        "error",
      );
    }
    setLoading(false);
  };

  //Cargas iniciales

  const sentFullscreen = async () => {
    await handleFullscreen.enter();
  };

  return (
    <FullScreen handle={handleFullscreen}>
      <Head>
        <title>Inicio</title>
      </Head>
      <section>
        <button
          onClick={sentFullscreen}
          className='absolute w-[200px] p-4 text-white'
        >
          <OpenInFull /> Pantalla completa
        </button>
        <div className='saucer__font'>
          <div className='container__auth'>
            <div className='flex justify-center'>
              <img src='./logo_con_fondo.png' alt='' className='w-44' />
            </div>
            <div className='auth__form'>
              <ul>
                <li className='grid my-2'>
                  <label className='name__label' htmlFor='name'>
                    Nombre:
                  </label>
                  <input
                    className='rounded-full name__input'
                    placeholder='Nombre'
                    type='text'
                    name='name'
                    id='user_name'
                    value={user}
                    onChange={handleUser}
                  />
                </li>
                <li className='grid my-2'>
                  <label className='password__label' htmlFor='password'>
                    Contraseña:
                  </label>
                  <input
                    className='rounded-full password__input'
                    placeholder='Contraseña'
                    type='password'
                    name='password'
                    id='user_password'
                    value={pass}
                    onChange={handlePass}
                  />
                </li>
                <li>
                  {loading ? (
                    <div className='flex items-center'>
                      <span className='loader mr-4'></span> Iniciando sesión
                    </div>
                  ) : (
                    <button
                      onClick={handleSend}
                      className='rounded-full submit__btn bg-success'
                      type='submit'
                    >
                      Ingresar
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </FullScreen>
  );
};

export default IndexComp;
