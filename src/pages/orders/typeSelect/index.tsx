import ProtectPage from "@/pages/admin/components/protectPage";
import DishCatalogPicker from "@/components/orders/DishCatalogPicker";
import { setCreateDishSelection } from "@/store/slices/create.order.slice";
import type { RootRedux } from "@/store/store";
import { DEFAULT_TABLE_LLEVAR } from "@/utils/constants";
import { currencyFormat } from "@/utils/formats";
import { CHECKS } from "@/utils/users";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function OrderDishPicker() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    tableNumber,
    dishesDescription,
    dishes: dishCount,
  } = useSelector((state: RootRedux) => state.orderCreate);
  useEffect(() => {
    if (router.isReady && !tableNumber)
      void router.replace("/orders/tableSelect");
  }, [router, tableNumber]);

  const subtotal = dishesDescription.reduce(
    (total, dish) => total + dish.price * (dish.number ?? 0),
    0,
  );

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Platillos | Nueva orden</title>
      </Head>
      {tableNumber > 0 && (
        <main className='min-h-screen bg-slate-100 px-4 py-5 pb-32 text-slate-900 sm:px-8'>
          <div className='mx-auto max-w-5xl space-y-5'>
            <header className='rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
              <Link
                href='/orders/tableSelect'
                className='mb-3 inline-flex items-center gap-2 rounded text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2'
              >
                <ArrowBack fontSize='small' /> Elegir mesa
              </Link>
              <p className='text-sm font-medium text-slate-200'>
                {tableNumber === DEFAULT_TABLE_LLEVAR
                  ? "Para llevar"
                  : `Mesa ${tableNumber}`}
              </p>
              <h1 className='mt-1 text-3xl font-semibold tracking-tight'>
                Añadir platillos
              </h1>
            </header>

            <DishCatalogPicker
              selection={dishesDescription}
              onChange={(selection) =>
                dispatch(setCreateDishSelection(selection))
              }
            />
          </div>

          <footer className='fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-3 shadow-lg sm:px-8'>
            <div className='mx-auto flex max-w-5xl items-center justify-between gap-3'>
              <div aria-live='polite'>
                <p className='text-sm text-slate-600'>
                  {dishCount} {dishCount === 1 ? "platillo" : "platillos"}
                </p>
                <p className='font-semibold'>{currencyFormat(subtotal)}</p>
              </div>
              <button
                type='button'
                disabled={!dishCount}
                onClick={() => router.push("/orders/finishOrder")}
                className='inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark disabled:bg-slate-200 disabled:text-slate-600'
              >
                Revisar orden <ArrowForward fontSize='small' />
              </button>
            </div>
          </footer>
        </main>
      )}
    </ProtectPage>
  );
}
