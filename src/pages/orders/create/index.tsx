import { useReadyOrders } from "@/hooks/Wainters/useReadyOrders";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import ProtectPage from "@/pages/admin/components/protectPage";
import { resetCreateCommanda } from "@/store/slices/create.order.slice";
import { resetComanda } from "@/store/slices/orders.slice";
import { resetUserRedux } from "@/store/slices/user.slice";
import type { RootRedux } from "@/store/store";
import { TOKEN_ID } from "@/utils/strings";
import { CHECKS } from "@/utils/users";
import {
  AddRounded,
  ArrowForward,
  CheckCircleOutline,
  ListAltOutlined,
  Logout,
  RoomServiceOutlined,
} from "@mui/icons-material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function WaiterHomePage() {
  const { name, uuid, type } = useSelector((store: RootRedux) => store.user);
  const { orders, loading, error, retry } = useReadyOrders(
    type === CHECKS ? uuid : "",
  );
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetComanda());
  }, [dispatch]);

  const startOrder = () => {
    dispatch(resetCreateCommanda());
    void router.push("/orders/tableSelect");
  };

  const signOut = () => {
    sessionStorage.removeItem(TOKEN_ID);
    dispatch(resetUserRedux());
    void router.push("/admin");
  };

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Inicio | Meseros</title>
      </Head>
      <main className='min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-8 lg:py-12'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <header className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
            <div className='flex items-center gap-4'>
              <span
                className='grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15'
                aria-hidden='true'
              >
                <RoomServiceOutlined />
              </span>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                {name ? `Hola, ${name}` : "Inicio"}
              </h1>
            </div>
            <button
              type='button'
              onClick={signOut}
              className='inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2'
            >
              <Logout fontSize='small' /> Cerrar sesión
            </button>
          </header>
          <div className='grid gap-4 sm:grid-cols-2'>
            <button
              type='button'
              onClick={startOrder}
              className='flex items-center gap-4 rounded-2xl bg-blue-dark p-5 text-left text-white shadow-sm transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark sm:p-6'
            >
              <span
                className='grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15'
                aria-hidden='true'
              >
                <AddRounded />
              </span>
              <span className='flex-1 text-lg font-semibold'>Nueva orden</span>
              <ArrowForward fontSize='small' />
            </button>
            <Link
              href='/orders/myOrders'
              className='flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-blue-dark shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark sm:p-6'
            >
              <span
                className='grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-dark/10'
                aria-hidden='true'
              >
                <ListAltOutlined />
              </span>
              <span className='flex-1 text-lg font-semibold'>Mis órdenes</span>
              <ArrowForward fontSize='small' />
            </Link>
          </div>
          <hr className='border-slate-300' />
          <section aria-labelledby='ready-orders' className='space-y-3'>
            <h2 id='ready-orders' className='text-xl font-semibold'>
              Órdenes listas
            </h2>
            {loading && (
              <p role='status' className='text-sm text-slate-600'>
                Cargando órdenes…
              </p>
            )}
            {error && (
              <p
                role='alert'
                className='rounded-2xl bg-white p-4 text-sm text-rose-800'
              >
                No se pudieron cargar las órdenes.{" "}
                <button
                  type='button'
                  onClick={retry}
                  className='font-semibold underline'
                >
                  Reintentar
                </button>
              </p>
            )}
            {!loading && !error && orders.length === 0 && (
              <p className='rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600'>
                Todavía no tienes órdenes listas.
              </p>
            )}
            {orders.length > 0 && (
              <ul className='grid gap-3 sm:grid-cols-2'>
                {orders.map((order) => (
                  <li key={order.uuid}>
                    <Link
                      href={`/orders/notes/${order.uuid}`}
                      className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark'
                    >
                      <span
                        className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700'
                        aria-hidden='true'
                      >
                        <CheckCircleOutline fontSize='small' />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <span className='block break-words font-semibold'>
                          {order.tableNumber === DEFAULT_TABLE_LLEVAR
                            ? order.name
                              ? `Para llevar · ${order.name}`
                              : "Para llevar"
                            : `Mesa ${order.tableNumber}`}
                        </span>
                        <span className='text-sm text-slate-600'>
                          {order.dishes}{" "}
                          {order.dishes === 1 ? "platillo" : "platillos"}
                        </span>
                      </span>
                      <ArrowForward
                        fontSize='small'
                        className='text-blue-dark'
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </ProtectPage>
  );
}
