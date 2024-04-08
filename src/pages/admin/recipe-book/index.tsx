import { useRouter } from "next/router";
import MenuAdmin from "../components/menu";
import ProtectPage from "../components/protectPage";
import { ADMIN } from "@/utils/users";
import { MenuBook } from "@mui/icons-material";

const InventoryPage = () => {
  const router = useRouter();

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <div className='flex flex-row'>
        <MenuAdmin basePath={router.pathname} router={router} />
        <div className='w-full p-4'>
          <div className='flex flex-col w-full'>
            <p className='flex flex-row font-primary text-[2rem] text-blue-dark'>
              <MenuBook fontSize='large' className='mr-2' /> Recetario
            </p>
            <p className='font-secondary text-[1rem] text-steel-70'>
              Aquí puedes meter las recetas de tu negocio y compartirlas con los
              demas restaurantes que tengas, ¡Además puedes vincularlo a
              cualquier producto!
            </p>
          </div>
        </div>
      </div>
    </ProtectPage>
  );
};

export default InventoryPage;
