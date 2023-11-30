import { useRouter } from "next/router";
import MenuAdmin from "../components/menu";

const UsersAdministratorPage = () => {
  const router = useRouter();
  return (
    <div className='flex flex-row'>
      <MenuAdmin router={router} basePath={router.pathname} />
      <div></div>
    </div>
  );
};

export default UsersAdministratorPage;
