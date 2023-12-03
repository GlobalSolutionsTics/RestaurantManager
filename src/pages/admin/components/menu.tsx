import {
  FilterFramesOutlined,
  KitchenOutlined,
  MiscellaneousServicesOutlined,
  PeopleOutline,
  PowerSettingsNewOutlined,
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
    sessionStorage.removeItem("rest-token");
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
        <div className='text-white font-primary py-4 text-center text-[0.5rem]'>
          Administrador
        </div>
      </div>
      <div className='hidden lg:block'>
        <MenuOption path={basePath} href={"/admin/dishes"}>
          <SetMealOutlined className='mr-4' /> Platillos
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/users"}>
          <PeopleOutline className='mr-4' /> Usuarios
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/kitchen"}>
          <KitchenOutlined className='mr-4' /> Cocinas
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/orders"}>
          <FilterFramesOutlined className='mr-4' /> Ordenes
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/configuration"}>
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
        <MenuOption path={basePath} href={"/admin/dishes"}>
          <SetMealOutlined fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/users"}>
          <PeopleOutline fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/kitchen"}>
          <KitchenOutlined fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/orders"}>
          <FilterFramesOutlined fontSize='large' />
        </MenuOption>
        <MenuOption path={basePath} href={"/admin/configuration"}>
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
