import { useRouter } from "next/router";
import MenuAdmin from "./components/menu";
import Head from "next/head";

const OrdersPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Administrador | Ordenes</title>
      </Head>
      <div className='flex flex-row'>
        <MenuAdmin router={router} basePath={router.pathname} />
      </div>
    </>
  );
};

export default OrdersPage;
