import ProtectPage from "@/pages/admin/components/protectPage";
import { resetCreateCommanda } from "@/store/slices/create.order.slice";
import type { RootRedux } from "@/store/store";
import { CHECKS } from "@/utils/users";
import {
  ArrowForward,
  CheckCircleOutline,
  OpenInNew,
} from "@mui/icons-material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";

export default function QrCodePage() {
  const router = useRouter();
  const orderId = useSelector((store: RootRedux) => store.orderCreate.id);
  const dispatch = useDispatch();
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const path = orderId ? `/checks/${encodeURIComponent(orderId)}` : "";
  const url = origin && path ? new URL(path, origin).href : "";

  const finish = () => {
    dispatch(resetCreateCommanda());
    void router.replace("/orders/create");
  };

  return (
    <ProtectPage push={router.push} requiredProfiles={CHECKS}>
      <Head>
        <title>Confirmación de orden | Meseros</title>
      </Head>
      <main className='min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-8'>
        <div className='mx-auto max-w-xl space-y-5'>
          <header className='flex items-center gap-4 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
            <span
              className='grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15'
              aria-hidden='true'
            >
              <CheckCircleOutline />
            </span>
            <h1 className='text-3xl font-semibold tracking-tight'>
              {orderId ? "Orden enviada" : "Confirmación de orden"}
            </h1>
          </header>
          <section className='space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-8'>
            {orderId ? (
              <>
                <p className='text-slate-700'>
                  Escanea el código QR para consultar el estado de la orden.
                </p>
                <div className='mx-auto aspect-square w-full max-w-[17rem] rounded-2xl border border-slate-200 bg-white p-4'>
                  {url && (
                    <QRCode
                      value={url}
                      role='img'
                      aria-label='Código QR del estado de la orden'
                      className='h-full w-full'
                    />
                  )}
                </div>
                <a
                  href={path}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-blue-dark underline focus-visible:outline focus-visible:outline-2'
                >
                  Abrir seguimiento <OpenInNew fontSize='small' />
                </a>
              </>
            ) : (
              <p className='text-slate-600'>
                No hay una orden reciente para mostrar.
              </p>
            )}
          </section>
          <button
            onClick={finish}
            type='button'
            className='inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark'
          >
            Volver al inicio <ArrowForward fontSize='small' />
          </button>
        </div>
      </main>
    </ProtectPage>
  );
}
