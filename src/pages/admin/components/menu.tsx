import { TOKEN_ID } from "@/utils/strings";
import {
  URL_ADMIN_CONFIGURATIONS,
  URL_ADMIN_CONTABILITY,
  URL_ADMIN_DIRECTORY,
  URL_ADMIN_DISHES,
  URL_ADMIN_INVENTORY,
  URL_ADMIN_ORDERS,
  URL_ADMIN_RECIP_BOOK,
  URL_ADMIN_USERS,
} from "@/utils/urls";
import {
  Book,
  FilterFramesOutlined,
  Inventory,
  MenuBook,
  MiscellaneousServicesOutlined,
  PeopleOutline,
  PowerSettingsNewOutlined,
  RequestQuote,
  SetMealOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

type Props = {
  basePath: string;
  router: any;
};

type TMenuOpt = {
  path: string;
  href: string;
  children: any;
};

const MenuOption = ({ path, href, children }: TMenuOpt) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 w-full flex items-left justify-left font-secondary block tracking-widest hover:bg-aqua hover:opacity-60 ${
        path === href ? "text-white bg-aqua" : ""
      }`}
    >
      {children}
    </Link>
  );
};

const MenuAdmin = ({ basePath, router }: Props) => {
  const handleClose = useCallback(() => {
    if (!router.isReady) {
      return;
    }
    sessionStorage.removeItem(TOKEN_ID);
    router.push("/admin");
  }, []);
  return (
    <div className='h-[100vh] w-[70px] lg:w-[20%] overflow-y-auto bg-white top-0'>
      <div className='w-full h-min-[30%] bg-blue-dark'>
        <div className='flex flex-col justify-center items-center pt-4'>
          <Image
            src={"/logo_con_fondo.png"}
            width={200}
            height={200}
            alt='Image logo'
          />
        </div>
        <div className='text-white font-primary py-4 text-center text-[0.5rem] lg:text-[1.5rem]'>
          Administrador
        </div>
      </div>
      <div className='hidden lg:block'>
        <MenuOption path={basePath} href={URL_ADMIN_DISHES}>
          <SetMealOutlined className='mr-4' /> Platillos
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_USERS}>
          <PeopleOutline className='mr-4' /> Usuarios
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_DIRECTORY}>
          <Book className='mr-4' /> Directorio
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_ORDERS}>
          <FilterFramesOutlined className='mr-4' /> Ordenes
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_INVENTORY}>
          <Inventory className='mr-4' /> Inventario
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_RECIP_BOOK}>
          <MenuBook className='mr-4' /> Recetario
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_CONTABILITY}>
          <RequestQuote className='mr-4' /> Contabilidad
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_CONFIGURATIONS}>
          <MiscellaneousServicesOutlined className='mr-4' /> Configurador
        </MenuOption>
        <button
          className='px-4 py-2 w-full font-secondary flex items-left justify-left tracking-widest hover:bg-aqua hover:opacity-60'
          onClick={handleClose}
        >
          <PowerSettingsNewOutlined className='mr-4' /> Cerrar sesión
        </button>
      </div>
      <div className='lg:hidden'>
        <MenuOption path={basePath} href={URL_ADMIN_DISHES}>
          <SetMealOutlined fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_USERS}>
          <PeopleOutline fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_DIRECTORY}>
          <Book fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_ORDERS}>
          <FilterFramesOutlined fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_INVENTORY}>
          <Inventory fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_RECIP_BOOK}>
          <MenuBook fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_CONTABILITY}>
          <RequestQuote fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={URL_ADMIN_CONFIGURATIONS}>
          <MiscellaneousServicesOutlined fontSize='large' />
        </MenuOption>
        <button
          className='px-4 py-2 w-full font-secondary flex items-left justify-left tracking-widest hover:bg-aqua hover:opacity-60'
          onClick={handleClose}
        >
          <PowerSettingsNewOutlined fontSize='large' />
        </button>
      </div>
    </div>
  );
};

export default MenuAdmin;
