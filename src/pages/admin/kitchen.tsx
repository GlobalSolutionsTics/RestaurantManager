import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import Head from "next/head";

const KitchenPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Adminsitrador | Administrar cocinas</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
      </div>
    </>
  );
};

export default KitchenPage;
