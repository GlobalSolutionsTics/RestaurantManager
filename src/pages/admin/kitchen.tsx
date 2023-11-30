import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import Head from "next/head";
import ProtectPage from "./components/protectPage";

const KitchenPage = () => {
  const router = useRouter();
  return (
    <ProtectPage push={router.push}>
      <Head>
        <title>Adminsitrador | Administrar cocinas</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
      </div>
    </ProtectPage>
  );
};

export default KitchenPage;
