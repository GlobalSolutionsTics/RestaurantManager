import {
  FilterFramesOutlined,
  KitchenOutlined,
  PeopleOutline,
  PowerSettingsNewOutlined,
  SetMealOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

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
      className={`px-4 py-2 w-full font-secondary block tracking-widest hover:bg-aqua hover:opacity-60 ${
        path === href ? "text-white bg-aqua" : ""
      }`}
    >
      {children}
    </Link>
  );
};

const MenuAdmin = ({ basePath, router }: Props) => {
  const handleClose = () => {
    sessionStorage.removeItem("rest-token");
    router.push("/admin");
  };
  return (
    <div className='h-[100vh] w-[20%] overflow-y-auto bg-white top-0'>
      <div className='w-full h-min-[30%] bg-blue-dark'>
        <div className='flex flex-col justify-center items-center pt-4'>
          <Image
            src={"/logo_con_fondo.png"}
            width={200}
            height={200}
            alt='Image logo'
          />
        </div>
        <div className='text-white font-primary py-4 text-center'>
          Administrador
        </div>
      </div>
      <MenuOption path={basePath} href={"/admin/dishes"}>
        <SetMealOutlined /> Platillos
      </MenuOption>
      <MenuOption path={basePath} href={"/admin/users"}>
        <PeopleOutline /> Usuarios
      </MenuOption>
      <MenuOption path={basePath} href={"/admin/kitchen"}>
        <KitchenOutlined /> Cocinas
      </MenuOption>
      <MenuOption path={basePath} href={"/admin/orders"}>
        <FilterFramesOutlined /> Ordenes
      </MenuOption>
      <Link
        href='#'
        className='px-4 py-2 w-full font-secondary block tracking-widest hover:bg-aqua hover:opacity-60'
        onClick={handleClose}
      >
        <PowerSettingsNewOutlined /> Cerrar sesión
      </Link>
    </div>
  );
};

export default MenuAdmin;
