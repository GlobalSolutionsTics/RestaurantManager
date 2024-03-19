import { StatusEnum } from "@/enums/states.enum";
import ProtectPage from "@/pages/admin/components/protectPage";
import { listConfigurationService } from "@/services/config";
import { setTableOrder } from "@/store/slices/orders.slice";
import { TConifg } from "@/types/configuration.types";
import { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { getActualDateDB } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS, TOKEN } from "@/utils/users";
import * as RT from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import { getAuth, signInAnonymously } from "firebase/auth";
import { child, get, getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function tableSelector() {
  const [loading, setLoading] = useState(false);
  const [kitchen, setKitchen] = useState([]);
  const [tablesActives, setTablesActives] = useState<number[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const handleNavigation = (table: number) => {
    dispatch(setTableOrder(table));
    router.push("/orders/typeSelect/");
  };

  //Area para los servicios
  const getConfigurationInfo = async () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    setLoading(true);
    if (token) {
      const petition: TConifg = await listConfigurationService(token);
      const list: any = new Array(petition.tablesActives).fill(0);
      setKitchen(list);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  //Cargas iniciales
  const init = useCallback(async () => {
    const auth = getAuth();
    await signInAnonymously(auth);
    const dbRef = ref(RT.realtimeDB);
    const date = getActualDateDB();
    const DB_RT =
      RT_ORDER_TABLE_NAME + "/" + date.year + "/" + date.month + "/" + date.day;
    const snapshot = await get(child(dbRef, DB_RT));
    if (snapshot.exists()) {
      const data: Array<TResponseOrders> = snapshot.val();
      const elements: Array<TResponseOrders> = Object.values(data).sort(
        (a: any, b: any) => a.orderId - b.orderId,
      );
      const filters = elements.filter(
        (itm) => itm.status !== StatusEnum.CLOSED,
      );
      const mapTables = filters.map((itm) => itm.tableNumber);
      setTablesActives(mapTables);
    }
  }, []);
  useEffect(() => {
    init();
    getConfigurationInfo();
  }, []);

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <div className='relative'>
        <p className='text-[2rem] bg-neutral-300 font-primary h-[120px] grid content-center px-10 w-screen'>
          ¿Que mesa atenderá?
        </p>
        <div className='p-8 grid'>
          {loading ? (
            <div className='flex items-center'>
              <span className='loader mr-4'></span> Cargando información del
              configurador
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 overflow-y-auto'>
              <div className='grid justify-items-center'>
                <button
                  onClick={() => handleNavigation(Number(DEFAULT_TABLE_LLEVAR))}
                  className={` bg-blue-dark text-white text-2xl font-secondary w-[150px] h-[150px]`}
                >
                  Para llevar
                </button>
              </div>
              {kitchen.map((itm, index) => (
                <div key={index} className='grid justify-items-center'>
                  <button
                    onClick={() => handleNavigation(Number(index + 1))}
                    className={`${
                      tablesActives.includes(index + 1)
                        ? "bg-danger"
                        : "bg-neutral-400"
                    } text-2xl font-secondary w-[150px] h-[150px]`}
                    disabled={tablesActives.includes(index + 1)}
                  >
                    Mesa {index + 1}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectPage>
  );
}
