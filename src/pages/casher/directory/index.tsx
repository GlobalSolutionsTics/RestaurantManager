import { useRouter } from "next/router";
import ProtectPage from "../../admin/components/protectPage";
import Head from "next/head";
import MenuCasher from "../components/menu";
import {
  AddOutlined,
  CancelOutlined,
  DeleteOutline,
  Edit,
  EditOutlined,
} from "@mui/icons-material";

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
  index,
  phone,
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
      <div className='font-secondary basis-1/4'>{adress}</div>
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
  const router = useRouter();
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
