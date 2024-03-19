import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import Head from "next/head";
import ProtectPage from "./components/protectPage";
import { ADMIN, TOKEN } from "@/utils/users";

const KitchenPage = () => {
  const router = useRouter();
  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Adminsitrador | Administrar cocinas</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
        <div className='flex flex-col w-full h-min-[100vh] p-8'>
          <p className='font-primary text-[2rem] mb-4 text-black'>
            Habilitar cocinas
          </p>
        </div>
      </div>
    </ProtectPage>
  );
};

export default KitchenPage;
