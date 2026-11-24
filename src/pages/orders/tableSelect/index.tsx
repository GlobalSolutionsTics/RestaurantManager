import { StatusEnum } from "@/enums/states.enum";
import ProtectPage from "@/pages/admin/components/protectPage";
import { listConfigurationService } from "@/services/config";
import { setCreateTableRDX } from "@/store/slices/create.order.slice";
import type { TResponseOrders } from "@/types/menu.types";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { getActualDateDB } from "@/utils/formats";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS } from "@/utils/users";
import { realtimeDB } from "@firebase/config";
import { RT_ORDER_TABLE_NAME } from "@models/names";
import {
  ArrowBack,
  ChevronRight,
  ShoppingBagOutlined,
  TableRestaurantOutlined,
} from "@mui/icons-material";
import { getAuth, signInAnonymously } from "firebase/auth";
import { get, ref } from "firebase/database";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function TableSelector() {
  const [tableCount, setTableCount] = useState(0);
  const [occupiedTables, setOccupiedTables] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) return;

    let active = true;
    const loadTables = async () => {
      try {
        const [configuration, snapshot] = await Promise.all([
          listConfigurationService(token),
          signInAnonymously(getAuth()).then(() =>
            get(
              ref(
                realtimeDB,
                `${RT_ORDER_TABLE_NAME}/${getActualDateDB().fullDate}`,
              ),
            ),
          ),
        ]);
        if (!active) return;
        if (!configuration) throw new Error("Configuración no disponible.");
        const count = Number(configuration.tablesActives);
        if (!Number.isSafeInteger(count) || count < 0)
          throw new Error("Cantidad de mesas inválida.");

        const orders: Record<string, TResponseOrders> = snapshot.val() ?? {};
        setTableCount(count);
        setOccupiedTables(
          Object.values(orders)
            .filter(
              ({ status }) =>
                status !== StatusEnum.CLOSED && status !== StatusEnum.CANCELED,
            )
            .map(({ tableNumber }) => tableNumber),
        );
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadTables();
    return () => {
      active = false;
    };
  }, [attempt]);

  const selectTable = (table: number) => {
    dispatch(setCreateTableRDX(table));
    void router.push("/orders/typeSelect");
  };

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Elegir mesa | Nueva orden</title>
      </Head>
      <main className='min-h-screen bg-slate-100 px-4 py-5 text-slate-900 sm:px-8'>
        <div className='mx-auto max-w-5xl space-y-5'>
          <header className='rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
            <Link
              href='/orders/create'
              className='mb-3 inline-flex items-center gap-2 rounded text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2'
            >
              <ArrowBack fontSize='small' /> Inicio
            </Link>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Elegir mesa
            </h1>
          </header>

          <button
            type='button'
            onClick={() => selectTable(DEFAULT_TABLE_LLEVAR)}
            className='flex w-full items-center gap-3 rounded-2xl bg-blue-dark p-4 text-left font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark'
          >
            <ShoppingBagOutlined /> <span className='flex-1'>Para llevar</span>{" "}
            <ChevronRight />
          </button>

          {loading && (
            <p
              role='status'
              className='rounded-2xl bg-white p-6 text-slate-600'
            >
              Cargando mesas…
            </p>
          )}
          {error && (
            <div
              role='alert'
              className='rounded-2xl bg-white p-6 text-rose-800'
            >
              No se pudieron cargar las mesas.{" "}
              <button
                type='button'
                className='ml-2 font-semibold underline'
                onClick={() => {
                  setLoading(true);
                  setError(false);
                  setAttempt((current) => current + 1);
                }}
              >
                Reintentar
              </button>
            </div>
          )}
          {!loading && !error && tableCount === 0 && (
            <p className='rounded-2xl bg-white p-6 text-slate-600'>
              No hay mesas configuradas.
            </p>
          )}
          {!loading && !error && tableCount > 0 && (
            <ul
              className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'
              aria-label='Mesas'
            >
              {Array.from({ length: tableCount }, (_, index) => index + 1).map(
                (table) => {
                  const occupied = occupiedTables.includes(table);
                  return (
                    <li key={table}>
                      <button
                        type='button'
                        onClick={() => selectTable(table)}
                        disabled={occupied}
                        className='flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600'
                      >
                        <TableRestaurantOutlined fontSize='small' />
                        <span>
                          <span className='block font-semibold'>
                            Mesa {table}
                          </span>
                          {occupied && <span className='text-xs'>Ocupada</span>}
                        </span>
                      </button>
                    </li>
                  );
                },
              )}
            </ul>
          )}
        </div>
      </main>
    </ProtectPage>
  );
}
